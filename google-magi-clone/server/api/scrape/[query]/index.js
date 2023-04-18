import * as cheerio from "cheerio";
import { Readability } from "@mozilla/readability";
import * as qs from "querystring";
import { JSDOM } from 'jsdom';

export default eventHandler(async (event) => {
  return {
    api: await scrapeGoogle(event.context.params.query),
  };
});

async function scrapeGoogle(query) {
  const response = await fetch(`https://www.google.com/search?q=${query}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const linkTags = $("a");
  
  let urls = [];

  linkTags.each((_, link) => {
    const href = $(link).attr('href');
    if (href.startsWith('/url?q=')) {
      let url = href.replace('/url?q=', '');
      url = qs.unescape(url.split('&sa=')[0]);

      if (url.startsWith('https://scholar.google.com/scholar_url?url=http')) {
        url = url.replace('https://scholar.google.com/scholar_url?url=', '').split('&')[0];
      } else if (url.includes('google.com/')) {
        return;
      }

      if (url.endsWith('.pdf')) {
        return;
      }

      if (url.includes('#')) {
        url = url.split('#')[0];
      }

      urls.push(url);
    }
  });

  const dedupedUrls = dedupeUrlsByHostname(urls);

  try {
    const documents = await fetchDocuments(dedupedUrls);
    return documents;
  } catch (error) {
    res.status(500).json({ message: 'Error processing URLs' });
  }
}


function dedupeUrlsByHostname(urls) {
  const uniqueHostnames = new Set();
  const dedupedUrls = [];

  for (const url of urls) {
    let { hostname } = new URL(url);

    // Remove 'www.' if it's present in the hostname
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    if (!uniqueHostnames.has(hostname)) {
      uniqueHostnames.add(hostname);
      dedupedUrls.push(url);
    }
  }

  return dedupedUrls;
}



async function fetchDocuments(urls) {
  try {
    const documents = await processUrls(urls);
    return documents;
  } catch (error) {
    console.error("Error processing URLs:", error);
    throw error;
  }
}

async function processUrls(urls) {
  const documents = await Promise.all(urls.map(scrapeAndParse));
  return documents.filter((document) => document.page_content !== 'FAILED');
}


async function scrapeAndParse(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    let $ = cheerio.load(html);
    const dom = new JSDOM(html, {
      url,
      contentType: 'text/html',
    });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    
    if (!article) {
      return {
        page_content: 'FAILED',
      }
    }

    const ogTitle = $('meta[property="og:title"]').attr('content') ?? 'N/A';
    const ogUrl   = $('meta[property="og:url"]').attr('content') ?? 'N/A';
    const ogImage = $('meta[property="og:image"]').attr('content') ?? 'N/A';
    let ogDesc    = $('meta[property="og:description"]').attr('content');
    const ogAuthor= $('meta[property="og:author"]').attr('content') ?? 'N/A';
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') ?? 'N/A';
    
    if (!ogDesc || ogDesc === '') {
      try {
        $ = cheerio.load(article.content);
        let contentDiv = $('#mw-content-text');
        if (!contentDiv) {
          contentDiv = $('div.content').first();
        }
        const paragraphs = contentDiv.children('p');
        let firstParagraph;

        paragraphs.each((index, element) => {
          const parentTag = $(element).parent().get(0).tagName;
          if (parentTag !== 'table') {
            firstParagraph = $(element).text();
            return false;
          }
        });

        if (firstParagraph) {
          ogDesc = firstParagraph.slice(0, 500);
          if (firstParagraph.length > 500) {
            ogDesc += '...';
          }
        } else {
          console.log('No suitable paragraph found.');
          ogDesc = 'Unknown.'
        }
        
      }
      catch (error) {
        ogDesc = 'Error: ' + error;
      }
    }

    return {
      page_content: cleanSourceText(article.content),
      metadata: {
        source: ogUrl,
        page_title: article.title,
        og_title: ogTitle,
        og_image: ogImage,
        og_desc: ogDesc,
        og_author: ogAuthor,
        favicon: favicon,
        url: url,
      },
    };
  } catch (error) {
    console.error(`FATAL: Error scraping and parsing ${url}:`, error);
    return null;
  }
}

const cleanSourceText = (text) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};