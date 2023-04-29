# Karspasky movie recommendation clone with Nuxt3 + Vuetify

### Karspasky’s version

[https://awesome-movies.life/?rank=sim&ix=1](https://awesome-movies.life/?rank=sim&ix=1)

### Overview of user flow

We can generalize the user flow to the following series of steps:

1. User performs a search for a movie using either
    1. Traditional full-text search (e.g. Fight Club), or
    2. LLM-based document QA (e.g. Movie where an insomniac descends into madness and starts a series of fight clubs around town)
        1. The user-provided text is embedded and a similarity search is performed across all the pre-computed embeddings in a vector store.
2. The user selects a movie
3. The user can then select a similar movie based on either
    1. LLM-based text similarity based on the movie plot, or
    2. CV-based image similarity based on the poster(s), movie stills, or crew member(s) profile pictures
4. A user can then select another movie, returning to 2)

### What data do we need and how do we retrieve and process it?

1. Detailed summarized movie information from the The Movie Database (TMDB) API
    1. TMDB also provides movie-related media such as posters, backdrops, and videos ✅
2. Detailed synopsis from either
    1. Scraped from IMDB ✅
    2. The Movie Spoiler ([https://themoviespoiler.com/](https://themoviespoiler.com/)) ✅
    3. Scrape the “Plot” section from Wikipedia pages ✅
3. Embeddings of data from 1 and 2
    1. Text-based embeddings using OpenAI ada-002,
    2. Image-based embeddings using a large-ish HuggingFace CV model (TBD)

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