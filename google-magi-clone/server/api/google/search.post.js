// import { defineLazyEventHandler } from 'h3'
import RobotsTxtParser from "robots-txt-parse";
import UserAgent from "user-agents";
import * as cheerio from "cheerio";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
// import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export default eventHandler(async (event) => {
    try {
        const result = await main(event);
        return result;
      } catch (error) {
        console.error('Error in main function:', error);
        // Return an appropriate error response
      }
});

async function main(event) {
    const body = await readBody(event);
    const timeout = 750; // 750 milliseconds
    const response = await scrapeUrls(body.urls, timeout);
    const docs = await createLangChainDocuments(response);
    const similar = await findSimilarDocuments(docs, body.query, body.openaiAPIKey);

    const uniqueImages = response.map((r) => r.images).flat()
    .filter((image, index, self) => {
        const srcs = self.map((img) => img.src);
        return index === srcs.indexOf(image.src);
    });
    
    const uniqueYoutubeLinks = Array.from(new Set(response.map((r) => r.videos).flat()));

    return {
      // api: await extractRobotsTxt(body),
      scrape: response,
      similar: similar,
      images: uniqueImages,
      videos: uniqueYoutubeLinks,
    };
  }

// We will scrape as much information as possible for `timeout` milliseconds.
async function fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutHandle = setTimeout(() => controller.abort(), timeout);

    const userAgent = new UserAgent();
    const headers = {
        "User-Agent": userAgent.toString(),
    };

    let partialContent = "";

    try {
        const response = await fetch(url, { signal, headers });
        const reader = response.body.getReader();

        while (true) {
            try {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                partialContent += new TextDecoder().decode(value);
                // console.log(`Fetched content for ${url}:`, partialContent.length);
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log(
                        `Request to ${url} timed out after ${timeout} ms with ${partialContent.length} data so far`
                    );
                    break;
                } else {
                    console.log("other error", error.name);
                    throw error;
                }
            }
        }

        return partialContent;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return "";
    } finally {
        clearTimeout(timeoutHandle);
    }
}



async function scrapeUrls(urls, timeout) {
    const fetchPromises = urls.map((url) => { return fetchWithTimeout(url, timeout).catch((error) => {
        console.error("Error in fetching URL", error);
        return "";
    })});

    const htmlArray = await Promise.all(fetchPromises);
    // console.log('---- AFTER PROMISE ALL');

    const ret = htmlArray.map((html, index) => {
        try {
            const url = urls[index];
            // Process the HTML as needed
            // console.log(`HTML for ${url}:`, html.length);

            if (html.length === 0) {
                return {
                        url: url,
                        // page_content: "",
                        text: "",
                        // page_content_length: 0,
                        text_length: 0,
                        images: [],
                        videos: [],
                    };
            }

            const dom = new JSDOM(html, {
                url,
                contentType: "text/html",
            });
            const reader = new Readability(dom.window.document);
            const article = reader.parse();

            if (!article) {
                console.log("article loading failed");
                return {
                        url: url,
                        // page_content: "",
                        text: "",
                        // page_content_length: 0,
                        text_length: 0,
                        images: [],
                        videos: [],
                    };
            }

            let $ = cheerio.load(article.content);
            const contentDiv = $("#readability-page-1").first();
            if (!contentDiv) {
                console.log("cannot find reader content");
                return {
                        url: url,
                        // page_content: "",
                        text: "",
                        // page_content_length: 0,
                        text_length: 0,
                        images: [],
                        videos: [],
                    };
            }

            // Also extract out images and its alt text.
            // If the image is a data-srcset, we will get the last image in the list.
            // If data-srcset is not available we will use the src attribute.
            // We will also filter out images that contains the word "missing".
            const imgTags = $("img");
            const images = imgTags
                .map((_, img) => {
                    const element = $(img);
                    const dataSrcset = element.attr("data-srcset");
                    const src = element.attr("src");
                    const alt = element.attr("alt");

                    // If data-srcset exists, split it by commas and spaces, and get the last element
                    let finalSrc = src;
                    if (dataSrcset) {
                        const srcsetList = dataSrcset.split(/,\s*/);
                        finalSrc = srcsetList[srcsetList.length - 1].split(" ")[0];
                    }

                    return { src: finalSrc, alt, source_url: url, source_index: index };
                })
                .get()
                .filter(({ src }) => {
                    return !src.includes("missing");
                });

            // Dedupe images
            const uniqueImages = images.filter((image, index, self) => {
                const srcs = self.map((img) => img.src);
                return index === srcs.indexOf(image.src);
            });

            // Find all YouTube links
            const aTags = $("a");
            const youtubeLinks = aTags
                .map((_, a) => {
                    const element = $(a);
                    const href = element.attr("href");
                    return href;
                })
                .get()
                .filter(
                    (href) => href.includes("youtube.com") || href.includes("youtu.be")
                );
            // Dedupe YouTube links
            const uniqueYoutubeLinks = Array.from(new Set(youtubeLinks));

            const paragraphs = contentDiv.find("p");
            let concatenatedText = "";

            paragraphs.each((_, p) => {
                const element = $(p);
                const innerHtml = element.html();
                const textContent = innerHtml.replace(/<[^>]*>/g, "");
                concatenatedText += textContent;
            });

            return {
                url: url,
                // page_content: contentDiv.html(),
                text: concatenatedText,
                // page_content_length: contentDiv.html().length,
                text_length: concatenatedText.length,
                images: uniqueImages,
                videos: uniqueYoutubeLinks,
            };
        } catch (error) {
            const url = urls[index];
            console.log("could not parse article for url: ", url, htmlArray[index].length, error);
            return {
                    url: url,
                    // page_content: "",
                    text: "",
                    // page_content_length: 0,
                    text_length: 0,
                    images: [],
                    videos: [],
                };
        }
    });
    return ret;
}


async function createLangChainDocuments(response, maxLength = 25000, chunkSize = 1000, chunkOverlap = 100) {
    const responseValid = response.filter((src) => {
        return src.text_length > 0;
    });
    const totalLength = responseValid.reduce(
        (sum, str) => sum + str.text_length,
        0
    );

    let trimLength = maxLength;
    if (totalLength > maxLength) {
        const numResponses = responseValid.length;
        trimLength = Math.floor(maxLength / numResponses);
    }

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
    });
    
    const fetchPromises = responseValid.map((r, index) => splitter.createDocuments([removeIncompleteTag(r.text.substring(0, trimLength))], [{ 'url': r.url, 'index': index }]));
    const docs = (await Promise.all(fetchPromises)).flat();
    return docs;
}


async function findSimilarDocuments(response, question, apiKey) {
    const embeddings = new OpenAIEmbeddings({openAIApiKey: apiKey});
    const store = await MemoryVectorStore.fromDocuments(response, embeddings);

    // Select the relevant documents
    // const question = "What did the president say about Justice Breyer";
    const relevantDocs = await store.similaritySearch(question);
    // console.log('the relevant docs are\n\n', relevantDocs);

    // If the total number of characters exceeds 3000 we keep only the top 6
    const topN = relevantDocs.slice(0,3).map((doc) => {
        return {
            url: doc.metadata.url,
            index: doc.metadata.index,
            context: doc.pageContent
        }
    });
    // console.log('top docs\n\n', topN);
    return topN;
}


// Split into chunks with LangChain
// First we make sure that we have at most 25k characters. If we have more, we will equally
// truncate the chunks to 25k characters.
// We choose 25k because that corresponds to 100 searches/$.
function removeIncompleteTag(str) {
    const openTagPos = str.lastIndexOf("<");
    const closeTagPos = str.lastIndexOf(">");

    if (openTagPos > closeTagPos) {
        return str.substring(0, openTagPos);
    }

    return str;
}



// Compute embeddings with OpenAI using LangChain

// Compute similarity with LangChain

// Return top results and perform OpenAI query on client side






async function fetchRobotsTxt(url, timeout) {
    return fetchWithTimeout(`${url}/robots.txt`, timeout);
}

async function extractRobotsTxt(body) {
    const userAgent = new UserAgent();
    const timeout = 750;
    // console.log("body", body);
    // console.log("user agent", userAgent.toString());

    await checkScrapingAllowed(body.urls, userAgent.toString(), timeout).then(
        (results) => {
            console.log("Scraping allowed:", results);
        }
    );
}

async function parseRobotsTxt(robotsTxt) {
    //   const parser = new RobotsTxtParser();
    try {
        return await RobotsTxtParser(robotsTxt);
        // return parser;
    } catch (error) {
        console.error("Error parsing robots.txt:", error.message);
        return null;
    }
}

async function checkScrapingAllowed(urls, userAgent, timeout) {
    const scrapingAllowed = [];

    for (const url of urls) {
        const robotsTxt = await fetchRobotsTxt(url, timeout);
        if (!robotsTxt) {
            // If robots.txt is not accessible, decide your default behavior here
            scrapingAllowed.push({ url, allowed: false });
            continue;
        }

        const parser = await parseRobotsTxt(robotsTxt, timeout);
        // console.log("return parser", parser);
        if (!parser) {
            // If robots.txt cannot be parsed, decide your default behavior here
            scrapingAllowed.push({ url, allowed: false });
            continue;
        }

        // console.log('parser first group',parser.groups[0])
        const filteredData = parser.groups.filter((item) => item.agents[0] === "*");
        // console.log("filtered data", filteredData);
        const filteredDataRoot = filteredData.filter(
            (item) => item.rules.path === "/"
        );
        // console.log("filtered root data", filteredDataRoot);
        const allowed = parser.isAllowed(userAgent, "/");
        scrapingAllowed.push({ url, allowed });
    }

    return scrapingAllowed;
}
