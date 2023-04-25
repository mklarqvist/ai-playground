# Google "Magi" clone with Nuxt3 + Vuetify

Google made a recent announcement (as of yesterday when writing this) unveiling a new project called "Magi." This initiative aims to integrate advanced large-language models with their search capabilities. As there is no public demo available for review, I've decided to create a clone inspired by the image provided below:

![Google Magi](github/google_magi.gif)

There are already competitors in this space, like Perplexity AI (perplexity.ai) which is chat tool that uses foundational language models, such as GPT-4 from OpenAI, along with current information from the internet. It not only provides answers, but also references to the sources that contributed to those answers. This simple, yet powerful approach addresses the limitation of potentially outdated training data used to train the models. By returning the sources used to provide an answer, you can verify its accuracy. This combats the issue of language models generating incorrect answers.

This may sound like a major project and a serious undertaking, but modern tools have made it surprisingly easy.

### Technical analysis: How is it possible that [Perplexity.ai](http://Perplexity.ai) is so fast?

Looking at the responses used for the answer, we can also see that it’s also the same sites, and in exactly the same order as in the Google search request. It could be Bing, but given they are raising their API costs 300-500% in the next few weeks it is doubtful — or would require some awkward conversations with their investors as I don’t think they can ever reach profitability then. This means they have to do one of of two things:

1. Derive their QA context from the search response metadata only, or
2. Use a hard cutoff while streaming data to maintain snappyness

I will implement both.

### Ethics

We want to build a search engine that is ethical and is respectful of the website owners (as determined by their `robot.txt` instructions). If a website declines to be crawled or indexed then we will respect their wishes. This could possibly result in the edge case where all the target sites in a query has declined crawling and we cannot construct a reference set of embeddings. If this is the case, we will simply not show an AI chat message and instead only display the Google results as-is.

### Overview of flow:

1. User performs a search query
2. Instantly return Google/Bing search results and display “Thinking…” in the Chat section
3. “Asking websites” — scrapes up to the top 10 results
    1. First, we query each websites `robots.txt` if we are allowed to scrape their website. If it is either disallowed or the query takes >200 ms, then that site is ignored. Since this is a small educational application, we cannot guarantee that we respect the `Crawl-delay` rule, for example in the case two related search queries returns the same domain within this period. 
    2. If we are allowed to scrape, then scrape as much data as possible from the URL over a maximum of 750 ms. If the entire target website cannot be scraped in this timeframe, we will sever the connection and proceed with whatever we have.
    3. We do not expect that all 10 target URLs will respond in this time frame.
4. “Producing chunks” — breaks websites into usable chunks with [LangChain](https://github.com/hwchase17/langchain)
5. “Producing embeddings” — creates embeddings from the chunks using OpenAI
6. “Computing similarity” — computes the cosine similarity using [LangChain](https://github.com/hwchase17/langchain)
7. Stuff the related sections of text as context into a LLM query and re-ask the query from 1 given this data — using a manual tweak of the default prompt in [LangChain](https://github.com/hwchase17/langchain) QA.
8. Display a “similar questions” or “related searches”
    1. Since neither Google nor Bing provides this data, we ask a LLM to perform dream up a few related questions. We do this by setting a really high temperature (like 1.0).

### Pricing

Current direct-to-consumer prices for different relevant OpenAI API queries:

| Model | Usage |
| --- | --- |
| gpt-3.5-turbo | \$0.002 / 1K tokens |
| Ada | \$0.0004 / 1K tokens |
| Google API | \$0.005 / query |

Let’s assume that we embed 25,000 tokens from the search results (on average) and perform a 4,000 token search, we end up with a cost of \$0.023/search — or approximately 44 searches/\$. Google earns around \$0.05/search (rough estimate), so they could still operate with a profit with this approach if implemented as-is today. Of course their operating costs using Bard and running everything local would probably be 1/10 of the direct-to-consumer pricing listed above.

### Some out-of-scope technical considerations:

It is expensive to compute chunks and embeddings all the time. How can we overcome this?

1. Make chunks + embeddings live in an ephemeral database (like Redis) with at most X GB of storage
2. Only scrape a website if the timestamp from Google/Bing has changed
3. Return embeddings only for the sites in the query (collect E1, E2, E3…) and collect them in an array and perform super-cheap cosine similarity computation and return the top results and their score. This way we don’t need to maintain a vector database at all since we only focus on the top-10 webpages and their contents and nothing else.

### Here is what we came up with

![Google Magi Clone Dark](github/google_magi_clone.gif)

and light mode

![Google Magi Clone Light](github/google_magi_clone_light.gif)

## How to use

0. Open `pages/index.vue` and enter your own keys where it says
```javascript
const google_api_key = 'YOUR-GOOGLE-API-KEY';
const google_api_cx = 'YOUR-GOOGLE-API-CX';
const openaiApiKey = 'YOUR-OPENAI-API-KEY';
```

1. Install the dependencies

```bash
npm install
```

2. Run the app

```bash
npm run dev --
```

That's it.