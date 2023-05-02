# Movie recommendation engine using foundational models

## Creating a movie recommendation engine: preprocessing

Watching movies is a popular pastime that offers relaxation and entertainment, allowing us to dive into new worlds and learn from various perspectives. However, the sheer number of available movies can make it challenging to decide what to watch next. Scrolling through streaming platforms, watching trailers, and checking IMDb ratings can be time-consuming, leaving us feeling frustrated and indecisive. If this situation sounds all too familiar, don't worry! I've got the solution for you: build your own movie recommendation engine designed to simplify your film selection process.

**The Movie Recommendation Engine: Your Personalized Movie Picker**

We will build a movie recommendation engine using AI-based text-similarity techniques to eliminate the need to scroll through endless movie options, watch countless trailers, and research IMDb ratings.  We will use state-of-the-art large foundational language models (LLMs) to provide users with personalized movie suggestions based on movie synopses. Here, we will delve into the details of how the algorithm works, including the user flow and the various methods it employs to find similar movies based on text and image inputs.

## The User Flow:

The user flow can be broken down into several key steps:

1. **Movie Search**:
Users can search for a movie in three distinct ways:
    
    A. *Traditional Full-Text Search:* Users can enter a movie title (e.g., Fight Club) and receive a list of relevant results. This method relies on traditional string matching and is suitable for users who know the exact or partial name of the film they are searching for. This functionality is straightforward and will not be the focus here.
    
    B. *Language Model-Based Document QA:* Users can input a description of a movie (e.g., "Movie where an insomniac descends into madness and starts a series of fight clubs around town"). The algorithm employs a large language model (LLM) to analyze the user's input and find movies that match the description. This method is ideal for users who have a rough idea of the plot of the film they want to watch.
    
    C. *Language Model-Based Text Similarity Search*: By comparing the synopsis of all movies pairwise, users can receive a list of the top-N most similar movies based on pre-computed text similarities. This method enables fast and effortless exploration of similar movies.
    
2. **Similarity Search:**
To enable approaches 1B and 1C, all movie synopsis texts in the database must be embedded. This application is limited to the top 10,000 most popular movies containing only Latin characters to simplify text searches. Given the pre-processed synopsis embeddings, the user's text is embedded, and a similarity search is performed across all pre-computed embeddings in the vector store. This process allows the engine to identify movies with comparable features or themes.
3. **Movie Selection:**
    
    After conducting the search, the user selects a movie from the list of results.
    
4. **Finding Similar Movies:**
    
    Once a movie is selected, the user can explore similar films based on two distinct criteria:
    
    A. *Language Model-Based Text Similarity*: This method, as described in steps 1B and 1C, analyzes movie plots and compares them using an LLM. By identifying textual similarities, the algorithm can suggest films with similar storylines or themes.
    
    B. *Computer Vision-Based Image Similarity*: As an additional bonus feature, our engine can utilize computer vision (CV) technology to compare visual elements of the selected movie, such as posters, movie stills, or crew members' profile pictures. By identifying similarities in visual content, the algorithm can recommend movies with a similar aesthetic or those involving the same actors or directors.
    
5. **Iterative Selection:**
    
    Users can continue to explore and select additional movies, returning to step 2. This process allows them to dive deeper into the world of cinema and discover films they may not have otherwise encountered.


## Data Acquisition and Processing for the Movie Recommendation Engine

To provide accurate and personalized movie recommendations, the engine relies on a variety of data sources and processing techniques. In this section, we will briefly explore the data required for the recommendation engine, as well as the methods used to retrieve and process it.

1. **Movie Information and Media:**
    
    The primary source of detailed movie information is The Movie Database (TMDB) API. This API provides comprehensive movie data, including summarized movie details, as well as movie-related media such as posters, backdrops, and videos.
    
2. **Movie Synopsis:**
    
    To obtain additional detailed movie synopses, we can use one or more of the following sources:
    
    A. IMDb: Movie synopses can be scraped from IMDb, a popular and extensive movie database.
    
    B. The Movie Spoiler: This website ([https://themoviespoiler.com/](https://themoviespoiler.com/)) offers detailed plot summaries for a wide range of movies, making it a valuable resource for our text similarity engine.
    
    C. Wikipedia: Another option is to scrape the "Plot" section from relevant movie Wikipedia pages, which typically provide a comprehensive summary of the film's story.
    
3. **Data Embeddings:**
    
    To enable the comparison of movies based on their textual and visual content, the data obtained from steps 1 and 2 must be embedded. We use the following approaches for this process:
    
    A. Text-Based Embeddings: We are going to use roberta-large-v1 ([https://huggingface.co/sentence-transformers/all-roberta-large-v1](https://huggingface.co/sentence-transformers/all-roberta-large-v1)) to create embeddings for all the textual data, such as movie synopses. OpenAI `ada`-based embeddings do not work particularly well for sentence-to-sentence comparisons.
    
    B. Image-Based Embeddings: For visual content, such as movie posters and stills, a large-scale computer vision model from HuggingFace (specific model to be determined) is used to generate image-based embeddings.
    

The movie recommendation engine relies on a diverse range of data sources and processing techniques to provide accurate and personalized movie suggestions.

## Computing embeddings of chunks and storage in a vector store

We can use a language model to compute embeddings for our input text (chunks). If you're unfamiliar with the concept of embeddings, imagine a pile of colored M&Ms in the middle of your table. Large foundational models have learned the general properties of M&Ms and will move them to different locations on the table based on their color. So you will end up with green M&Ms in one corner, blue in another, and so on. Now imagine we are given a cyan M&M. We've never seen that color before. But we know that cyan is a mix of green and blue, so it can be placed somewhere close to those colors on the table. We can then measure how far away the new cyan M&M is from each other M&M on the table. The closest one will be the most similar and the furthest one will be the most dissimilar.

Instead of M&Ms, we have chunks of documents. And instead of 2 dimensions, like our flat table surface, we have 1,000+ dimensions.


### How to use

0. Open `pages/index.vue` and enter your own keys where it says
```javascript
const apiKey = 'YOUR_API_KEY_HERE';
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

### Karspasky’s version

[https://awesome-movies.life/?rank=sim&ix=1](https://awesome-movies.life/?rank=sim&ix=1)