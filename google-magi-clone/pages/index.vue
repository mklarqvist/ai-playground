<!-- best question: why did elon rocket blow up? -->
<template>
  <div>

      <div class="d-flex pt-1 px-4" id="page-controls">
          <v-switch inset color="info" v-model="darkMode" @change="toggleTheme()" prepend-icon="mdi-moon-waxing-crescent"
              append-icon="mdi-white-balance-sunny" style="display: inherit;"></v-switch>

          <nuxt-link to="https://twitter.com/MarcusKlarqvist" target="_blank"><v-btn variant='text'><v-icon
                      size="28">mdi-twitter</v-icon></v-btn></nuxt-link>
          <nuxt-link to="https://github.com/mklarqvist/ai-playground" target="_blank"><v-btn variant='text'><v-icon
                      size="28">mdi-github</v-icon></v-btn></nuxt-link>
      </div>

      <v-container class="google-container">
          <!-- Search form -->
          <v-form @submit.prevent id="search-input" class="pulse">
              <v-textarea clearable id="chat-textarea" v-model="chatTextArea" rows="1" auto-grow hide-details="auto"
                  color="blue" variant="solo" @keypress.enter="(event) => searchQuestion(chatTextArea, event)">
                  <template v-slot:prepend-inner>
                      <img src="/google_logo.svg" height="24" alt="Google Logo" class="mr-2" />
                  </template>
              </v-textarea>
          </v-form>

          <!-- Action bar -->
          <h1 class="search-family-types-header">Filters and Topics</h1>
          <v-chip-group class="search-family-types my-2">
              <v-chip variant="outlined"><v-icon class="mr-1">mdi-image-outline</v-icon>Images</v-chip>
              <v-chip variant="outlined"><v-icon class="mr-1">mdi-newspaper-variant</v-icon>News</v-chip>
              <v-chip variant="outlined"><v-icon class="mr-1">mdi-tag-outline</v-icon>Shopping</v-chip>
              <v-chip variant="outlined"><v-icon class="mr-1">mdi-play-box-outline</v-icon>Video</v-chip>
          </v-chip-group>
          <v-divider></v-divider>

          <!-- Chat response -->
          <div class="chat-responses mt-3">
              <div v-if="chatChain.length > 1" v-for="(message, idx) in chatChain.slice(-1)" :key="`message-${idx}`">
                  <VueShowdown :ref="`chat-msg-${idx}`" class="markdown-body prose"
                      :class="isChatStreaming ? 'result-streaming' : ''" flavor="github" :options="{ emoji: true }"
                      :markdown="message.content">
                  </VueShowdown>
              </div>
          </div>

          <div class="mb-4 mt-1 d-flex justify-end" v-if="isChatFinished">
              <v-btn variant="text"><v-icon>mdi-thumb-up-outline</v-icon></v-btn>
              <v-btn variant="text"><v-icon>mdi-thumb-down-outline</v-icon></v-btn>
          </div>


          <!-- Similar questions section -->
          <template v-if="isSearchingSuggestions && !haveSuggestedQueries">
              <TransitionGroup appear tag="div" class="d-flex flex-wrap" @before-enter="OpacityonBeforeEnter"
                  @enter="OpacityonEnter" @leave="OpacityonLeave">
                  <v-skeleton-loader v-for="(skeleton, index) in 10" :key="skeleton" type="chip"
                      :width="skeletonChipWidth[index]" :data-index="index"></v-skeleton-loader>
              </TransitionGroup>
          </template>


          <template v-if="haveSuggestedQueries">
              <TransitionGroup appear tag="div" class="d-flex flex-wrap" @before-enter="OpacityonBeforeEnter"
                  @enter="OpacityonEnter" @leave="OpacityonLeave">

                  <nuxt-link @click.native.prevent="clickAskRelevant(chip)" to="#"
                      v-for="(chip, index) in processedSuggestedQueries" :key="chip" :data-index="index" target="_blank">
                      <v-chip class="mr-2 mb-2" variant="outlined">{{ chip }}</v-chip>
                  </nuxt-link>
              </TransitionGroup>
          </template>
      </v-container>

      <v-divider :thickness="10" class="my-4 mb-1"></v-divider>

      <!-- Search results -->
      <v-container>
          <div>
              <!-- Scraping data -->
              <div v-if="isScraping" class="d-flex">
                  <img src="dino_loader.gif" height="200" alt="dino running">
                  <p>Scraping...</p>
              </div>
              <!-- Scraping is finished -->
              <div v-if="isScrapingCompleted">
                  <!-- Images -->
                  <div class="d-flex">
                      <v-row>
                          <TransitionGroup appear @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
                              <v-col v-for="(image, index) in scrapedImages" cols="3" :key="`image-${index}`"
                                  :data-index="index">
                                  <div>
                                      <nuxt-link :to="image.source_url" target="_blank">
                                          <img :src="`https://www.google.com/s2/favicons?domain=${image.source_url}&sz=16`"
                                              loading="lazy">
                                          <v-img aspect-ratio="16/9" cover :src="image.src" :alt="image.alt"
                                              loading="lazy" style="border-radius:12px;border:1px solid #aaa;"></v-img>
                                      </nuxt-link>
                                  </div>
                              </v-col>
                          </TransitionGroup>
                      </v-row>
                  </div>
              </div>
              <div class="d-flex my-10">
                  <div style="max-width: 648px;">
                      <!-- Search results -->
                      <template v-if="isSearchCompleted">
                          <TransitionGroup appear @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
                              <div class="search-result" v-for="(value, index) in search_response.items"
                                  :key="`dix-${index}`" :data-index="index">
                                  <div class="d-flex">
                                      <div class="me-auto">
                                          <nuxt-link :to="value.link" target="_blank">
                                              <div class="search-result-meta d-flex">
                                                  <span class="fav-icon-container"><img
                                                          :src="`https://www.google.com/s2/favicons?domain=${value.link}&sz=16`"
                                                          loading="lazy"></span>
                                                  <div class="d-flex flex-column">
                                                      <div class="search-result-meta-title">{{ value.displayLink }}</div>
                                                      <div class="search-result-meta-url">{{ value.formattedUrl }}</div>
                                                  </div>
                                              </div>

                                              <h3 class="search-result-title mt-2 mb-1">{{ value.title }}</h3>
                                          </nuxt-link>
                                          <div class="search-result-description">{{ value.snippet }}</div>
                                      </div>
                                      <!-- If there is an image -->
                                      <div v-if="hasImage(value)" class="ml-4">
                                          <nuxt-link :to="value.link" target="_blank">
                                              <v-img style="border-radius: 24px;border:1px solid #dadce0;"
                                                  class="bg-white" width="200" :aspect-ratio="1"
                                                  :src="value.pagemap.metatags[0]['og:image']" alt="" cover></v-img>
                                          </nuxt-link>
                                      </div>
                                  </div>
                              </div>
                          </TransitionGroup>
                      </template>


                  </div>
                  <div style="max-width: 432px;" class="ml-4">
                      <!-- Wikipedia scraping if available -->
                      <!-- TODO -->
                      <!-- Videos -->
                      <TransitionGroup appear @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
                          <iframe width="420" height="315" v-for="(video, index) in scrapedVideos"
                              :src="getYoutubeId(video)" :key="`video-${index}`" :data-index="index">
                          </iframe>
                      </TransitionGroup>
                  </div>
              </div>
          </div>
      </v-container>
  </div>
</template>

<script setup>
import { VueShowdown } from "vue-showdown";
import { fetchStreamedChat } from '~/server/streamer';
import { Document } from "langchain/document";
import { searchHistoryStore } from '@/stores/search'
import { useTheme } from "vuetify";
import gsap from 'gsap'


// const store = searchHistoryStore() // Use this if you want to persist the search history and responses
const search_response = ref(null);
const isSearchCompleted = ref(false);
const isSearching = ref(false);
const isScraping = ref(false);
const isScrapingCompleted = ref(false);
const isChatStreaming = ref(false);
const isChatFinished = ref(false);
const suggestedQueries = ref([]);
const isSearchingSuggestions = ref(false);
const haveSuggestedQueries = ref(false);
const processedSuggestedQueries = ref([]);
const skeletonChipWidth = Array.from({ length: 10 }, () => Math.random() * (200 - 100) + 100);
const chatTextArea = ref(null);

// These are used in the mode when we scrape from the meta results from Google
const snippets = ref([]);
const descriptions = ref([]);
const metaBody = ref([]);
// These are used in the mode when we scrape from the actual pages
const allSearchData = ref([]);
const charLength = ref(0);
const allSearchDataDeduped = ref([]);
const chatChain = ref([]);
const scrapedResults = ref([]);
const scrapedImages = ref([]);
const scrapedVideos = ref([]);
const scrapedContext = ref([]);

const theme = useTheme();
const darkMode = ref(false);

const toggleTheme = () => {
  theme.global.name.value = darkMode.value ? "dark" : "light";
};


const google_api_key = 'YOUR-GOOGLE-API-KEY';
const google_api_cx = 'YOUR-GOOGLE-API-CX';
const openaiApiKey = 'YOUR-OPENAI-API-KEY';

function hasImage(value) {
  try {
      return value.pagemap?.metatags?.[0]?.['og:image'] ?? false
  } catch {
      return false;
  }
}

function hasSitename(value) {
  try {
      return value.pagemap?.metatags?.[0]?.['og:site_name'] ?? new URL(value.link).hostname;
  } catch {
      return new URL(value.link).hostname;
  }
}

// Steps:
// 1. Perform the Google query and retrieve the results
// 2. Process the results into a format usable by LngChain.
// 3. Compute embeddings for the results using the OpenAI API.
// 4. Compute the similarity between the embeddings and the question.
// 5. Sort the results by similarity and return the top N results.
const googleSearch = async (question) => {
  // store.searchHistory.push(question);
  // Step 1. Perform as Google search query and retrieve the results
  isSearching.value = true;
  // Promise chain
  await useFetch(`https://www.googleapis.com/customsearch/v1?key=${google_api_key}&cx=${google_api_cx}&q=${encodeURIComponent(question)}&sxsrf=APwXEddWEXesmZNlNIWkyps246ZpKr5Bkg:1682369765159&source=lnt&tbs=qdr:y&sa=X&ved=2ahUKEwiVru7hs8P-AhUvMlkFHZjHDdEQpwV6BAgBEAs&biw=1512&bih=831&dpr=2`).then(({ data }) => {
      // Since the response will be a nested Proxy, we need to convert it to a plain object
      // in order to be able to store it in the store. If we don't do this, the store will
      // not be able to serialize the data and thus also not be able to persist it.
      const flattenedData = JSON.parse(JSON.stringify(data.value));
      // store.searchResponses.push(flattenedData);
      console.log('flattened', flattenedData)
      console.log('flattened items', flattenedData.items)
      search_response.value = flattenedData;
      isSearching.value = false;
      isSearchCompleted.value = true;

      // // This is for the approach where we scrape the meta results from the Google response API
      // Chain the promises together
      // processQuery(search_response.value)
      //     .then(askLanguageModel(
      //         allSearchDataDeduped.value, 
      //         question, 
      //         openaiApiKey));
  })

  isScraping.value = true;
  const similarity = await useFetch('/api/google/search', {
      method: 'POST',
      body: {
          'query': question,
          'openaiAPIKey': openaiApiKey,
          'urls': search_response.value.items.map((item) => item.link),
      }
  })
  scrapedResults.value = similarity;
  const collapsedContext = similarity.data.value.similar.reduce((acc, curr) => {
      return acc + curr.context
  }, '')

  scrapedImages.value = similarity.data.value.images;
  scrapedVideos.value = similarity.data.value.videos;
  scrapedContext.value = similarity.data.value.similar;
  isScraping.value = false;
  isScrapingCompleted.value = true;

  await askLanguageModel(collapsedContext, question, openaiApiKey);
  await askLanguageModelToMakeSuggestions(collapsedContext, question, openaiApiKey);
}

const searchQuestion = async (question, event) => {
  if (event) {
      event.preventDefault()
  }

  if (question) {
      await googleSearch(question);
  }
}

async function clickAskRelevant(question) {
  chatTextArea.value = question;
  await searchQuestion(question);
}

const getYoutubeId = (url) => {
  console.log('given url', url)
  const videoId = url.split('v=')[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  try {
      return embedUrl;
  } catch {
      return '';
  }
}

function splitMarkdownList(list) {
  const lines = list.split('\n');
  const items = lines.map(line => line.replace(/^\d+\.\s*/, ''));
  return items;
}

const processQuery = async (data) => {
  // Step 2. Process the results into a format usable by LngChain.
  // Conver the input data to a series of LangChain Document objects that we
  // will use to compute embeddings from using the OpenAI API. Each LangChain
  // Document will contain the text of interest and any meta data we define:
  // in this case the index mapping back to the search result array.
  // There are three possible places to get meaningful text from:
  // 1. The snippet
  // 2. The og:description
  // 3. The body of the page
  // We will use all three to get the most accurate results.
  // Since some of the results may not have any, or all, of the above, we will filter out
  // those. We will keep track of the index of the original search result so we can
  // map back to the original search result array.
  // Extract out og:description
  descriptions.value = data.items.map((item, index) => new Document({ pageContent: item.pagemap?.metatags?.[0]?.['og:description'] ?? null, metadata: { source: item.link, index: index, tag: 'meta:og:description' } }),).filter((doc) => doc.pageContent)
  // Extract out body (a rare case)
  metaBody.value = data.items.map((item, index) => new Document({ pageContent: item.pagemap?.metatags?.[0]?.['body'] ?? null, metadata: { source: item.link, index: index, tag: 'meta:body' } }),).filter((doc) => doc.pageContent)
  // Extract out snippets (computed by Google)
  snippets.value = data.items.map((item, index) => new Document({ pageContent: item.snippet ?? null, metadata: { source: item.link, index: index, tag: 'snippet' } }),).filter((doc) => doc.pageContent)
  // Smash them all together using a spread operator
  allSearchData.value = [...descriptions.value, ...metaBody.value, ...snippets.value];
  // Compute the total number of characters in the search results
  charLength.value = allSearchData.value.reduce((accumulator, currentValue) => accumulator + currentValue.pageContent.length, 0)
  // Since it's possible that the same information is returned multiple times, we need to dedupe the array
  // using the pageContent as the unique identifier in a hash map.
  var seen = {};
  allSearchDataDeduped.value = allSearchData.value.filter(function (item) {
      return seen.hasOwnProperty(item.pageContent) ? false : (seen[item] = true);
  });
  console.log('unique_docs length', allSearchDataDeduped.value.reduce((accumulator, currentValue) => accumulator + currentValue.pageContent.length, 0));
}


const askLanguageModel = async (context, question, apiKey) => {
  // const context = data.reduce((accumulator, currentValue, currentIndex) => accumulator + (currentIndex + 1) + ": " + currentValue.pageContent + '\n\n', '')

  // This is the default template from LangChain for retrieva QA:
  // const prompt_template = "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer."
  // We are goign to modify it to include the context from the search results.
  chatChain.value = [{ role: 'system', content: `You are a helpful assistant and expert communicator with exceptional story-telling skills that answer questions with as much detail as possible given a provided context. If you don't know the answer, just say that you don't know, don't try to make up an answer.` }]
  chatChain.value.push({ role: 'user', content: `${question}\nContext:\n${context}` });
  chatChain.value.push({ role: 'assistant', content: '' });


  console.log(chatChain.value);
  // For question-answering, it is common to set the temperature to 0.0 to get the most likely answer. We
  // will use a slightly higher temperature to get a more comprehensive answer but still within the bounds
  // of the context.
  isChatStreaming.value = true;
  isChatFinished.value = false;
  await fetchStreamedChat({
      apiKey,
      messageInput: chatChain.value.slice(0, -1),
      maxTokens: 1000,
      temperature: 0.01,
      fetchTimeout: 10000,
  }, (responseChunk) => {
      // get the actual content from the JSON
      const content = JSON.parse(responseChunk).choices[0].delta.content;
      if (content) {
          chatChain.value.at(-1).content += content;
      }
  })
  isChatStreaming.value = false;
  isChatFinished.value = true;
  // store.searchResponses.push(chatChain.value.at(-1).content);
}

const askLanguageModelToMakeSuggestions = async (context, question, apiKey) => {
  suggestedQueries.value.push({ role: 'system', content: 'Suggest 10 related searches that would be relevant and interesting given the provided context and previous question. Do not talk to me. Do not reply with anything but the search queries.' },);
  suggestedQueries.value.push({ role: 'user', content: `Previous question:\n${question}\nContext:\n${context}` });
  suggestedQueries.value.push({ role: 'assistant', content: '' });
  isSearchingSuggestions.value = true;
  await fetchStreamedChat({
      apiKey,
      messageInput: suggestedQueries.value,
      maxTokens: 1000,
      temperature: 1.0,
      fetchTimeout: 10000,
  }, (responseChunk) => {
      const content = JSON.parse(responseChunk).choices[0].delta.content;
      if (content) {
          suggestedQueries.value.at(-1).content += content;
      }
  })
  processedSuggestedQueries.value = splitMarkdownList(suggestedQueries.value.at(-1).content);
  haveSuggestedQueries.value = true; // Add before streaming to animate
  isSearchingSuggestions.value = false;
}

// Todo: If one of the domains in the list is Wikipedia then perform a Wikipedia-specific scraping
// query to retrieve the summarization paragraph and summarization table. You can see this on both
// Google and Bing search results.


// Animation with greensocket
const onBeforeEnter = (el) => {
  el.style.opacity = 0
  el.style.x = 0
}

const onEnter = (el, done) => {
  gsap.to(el, {
      opacity: 1,
      x: '1em',
      delay: el.dataset.index * 0.15,
      onComplete: done
  })
}

const onLeave = (el, done) => {
  gsap.to(el, {
      opacity: 0,
      x: '-1em',
      delay: el.dataset.index * 0.15,
      onComplete: done
  })
}

// Animation with greensocket
const OpacityonBeforeEnter = (el) => {
  el.style.opacity = 0
}

const OpacityonEnter = (el, done) => {
  gsap.to(el, {
      opacity: 1,
      delay: el.dataset.index * 0.15,
      onComplete: done
  })
}

const OpacityonLeave = (el, done) => {
  gsap.to(el, {
      opacity: 0,
      delay: el.dataset.index * 0.15,
      onComplete: done
  })
}


</script>

<style>
body {
  font-family: arial, sans-serif;
}

a {
  color: blue;
}

a:hover {
  text-decoration: underline;
}

a:visited {
  color: purple;
}

.google-container {
  max-width: 50rem !important;
}

#search-input .v-field {
  border-radius: 24px;
}

#search-input:hover .v-field {
  box-shadow: 0 2px 8px 1px rgba(64, 60, 67, .24);
  border-color: rgba(223, 225, 229, 0);
}

.search-result {
  margin: 30px 0;
  --search-result-color: #202124;
  ;
  --search-result-description-color: #4d5156;
  --search-result-a: blue;
}

.v-theme--dark .search-result {
  margin: 30px 0;
  --search-result-color: #dadce0;
  --search-result-description-color: #bdc1c6;
  --search-result-a: #8ab4f8;
}

.search-result a {
  color: var(--search-result-a);
}


a:hover .search-result-meta {
  text-decoration: none;
}

.search-result-meta-title {
  color: var(--search-result-color);
  font-size: 14px;
  max-width: 200px;
  display: block;
  line-height: 20px;
  white-space: nowrap;
}

.search-result-meta-url {
  max-width: 315px;
  font-size: 12px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result-description {
  line-height: 1.58;
  text-align: left;
  font-size: 14px;
  color: var(--search-result-description-color);
}

.search-family-types {
  --chip-background-color: #fff;
  --chip-border: 1px solid #dadce0;
  --chip-border-icon-color: #4285f4;
}

.v-theme--dark .search-family-types {
  --chip-background-color: transparent;
  --chip-border: 1px solid rgba(255, 255, 255, 0.2);
  --chip-border-icon-color: #fff;
}

.search-family-types>.v-chip {
  background-color: var(--chip-background-color);
  border: var(--chip-border);
  border-radius: 20px;
  min-width: 48px;
  padding: 0 14px;
  height: 40px !important;
}

.search-family-types .v-icon {
  color: var(--chip-border-icon-color);
}

.search-family-types-header {
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
  z-index: -1000;
  user-select: none;
}

.search-read-more {
  font-size: 14px;
  font-weight: 500;
  color: #aaa;
}

.fav-icon-container {
  background-color: #f1f3f4;
  border-radius: 50%;
  border: 1px solid #ecedef;
  text-size-adjust: none;
  display: inline-block;
  line-height: 26px;
  padding: 0 4px;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 38px;
  height: 38px;
}

/* From OpenAI */

.prose {
  color: var(--tw-prose-body);
}

.prose :where([class~=lead]):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-lead);
  font-size: 1.25em;
  line-height: 1.6;
  margin-bottom: 1.2em;
  margin-top: 1.2em
}

.prose :where(a):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-links);
  font-weight: 500;
  text-decoration: underline
}

.prose :where(strong):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-bold);
  font-weight: 600
}

.prose :where(a strong):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(blockquote strong):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(thead th strong):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(ol):not(:where([class~=not-prose] *)) {
  list-style-type: decimal;
  margin-bottom: 1.25em;
  margin-top: 1.25em;
  padding-left: 1.625em
}

.prose :where(ol[type=A]):not(:where([class~=not-prose] *)) {
  list-style-type: upper-alpha
}

.prose :where(ol[type=a]):not(:where([class~=not-prose] *)) {
  list-style-type: lower-alpha
}

.prose :where(ol[type=A s]):not(:where([class~=not-prose] *)) {
  list-style-type: upper-alpha
}

.prose :where(ol[type=a s]):not(:where([class~=not-prose] *)) {
  list-style-type: lower-alpha
}

.prose :where(ol[type=I]):not(:where([class~=not-prose] *)) {
  list-style-type: upper-roman
}

.prose :where(ol[type=i]):not(:where([class~=not-prose] *)) {
  list-style-type: lower-roman
}

.prose :where(ol[type=I s]):not(:where([class~=not-prose] *)) {
  list-style-type: upper-roman
}

.prose :where(ol[type=i s]):not(:where([class~=not-prose] *)) {
  list-style-type: lower-roman
}

.prose :where(ol[type="1"]):not(:where([class~=not-prose] *)) {
  list-style-type: decimal
}

.prose :where(ul):not(:where([class~=not-prose] *)) {
  list-style-type: disc;
  margin-bottom: 1.25em;
  margin-top: 1.25em;
  padding-left: 1.625em
}

.prose :where(ol>li):not(:where([class~=not-prose] *))::marker {
  color: var(--tw-prose-counters);
  font-weight: 400
}

.prose :where(ul>li):not(:where([class~=not-prose] *))::marker {
  color: var(--tw-prose-bullets)
}

.prose :where(hr):not(:where([class~=not-prose] *)) {
  border-color: var(--tw-prose-hr);
  border-top-width: 1px;
  margin-bottom: 3em;
  margin-top: 3em
}

.prose :where(blockquote):not(:where([class~=not-prose] *)) {
  border-left-color: var(--tw-prose-quote-borders);
  border-left-width: .25rem;
  color: var(--tw-prose-quotes);
  font-style: italic;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 1.6em;
  margin-top: 1.6em;
  padding-left: 1em;
  quotes: "\201C" "\201D" "\2018" "\2019"
}

.prose :where(blockquote p:first-of-type):not(:where([class~=not-prose] *)):before {
  content: open-quote
}

.prose :where(blockquote p:last-of-type):not(:where([class~=not-prose] *)):after {
  content: close-quote
}

.prose :where(h1):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-headings);
  font-size: 2.25em;
  font-weight: 800;
  line-height: 1.1111111;
  margin-bottom: .8888889em;
  margin-top: 0
}

.prose :where(h1 strong):not(:where([class~=not-prose] *)) {
  color: inherit;
  font-weight: 900
}

.prose :where(h2):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-headings);
  font-size: 1.5em;
  font-weight: 700;
  line-height: 1.3333333;
  margin-bottom: 1em;
  margin-top: 2em
}

.prose :where(h2 strong):not(:where([class~=not-prose] *)) {
  color: inherit;
  font-weight: 800
}

.prose :where(h3):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-headings);
  font-size: 1.25em;
  font-weight: 600;
  line-height: 1.6;
  margin-bottom: .6em;
  margin-top: 1.6em
}

.prose :where(h3 strong):not(:where([class~=not-prose] *)) {
  color: inherit;
  font-weight: 700
}

.prose :where(h4):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: .5em;
  margin-top: 1.5em
}

.prose :where(h4 strong):not(:where([class~=not-prose] *)) {
  color: inherit;
  font-weight: 700
}

.prose :where(img):not(:where([class~=not-prose] *)) {
  margin-bottom: 2em;
  margin-top: 2em
}

.prose :where(figure>*):not(:where([class~=not-prose] *)) {
  margin-bottom: 0;
  margin-top: 0
}

.prose :where(figcaption):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-captions);
  font-size: .875em;
  line-height: 1.4285714;
  margin-top: .8571429em
}

.prose :where(code):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-code);
  font-size: .875em;
  font-weight: 600;
  color: #97c0ff;
  border-radius: 6px;
  background-color: rgba(151, 192, 255, 0.1);
  padding: 4px;
}


.prose :where(a code):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(h1 code):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(h2 code):not(:where([class~=not-prose] *)) {
  color: inherit;
  font-size: .875em
}

.prose :where(h3 code):not(:where([class~=not-prose] *)) {
  color: inherit;
  font-size: .9em
}

.prose :where(h4 code):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(blockquote code):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(thead th code):not(:where([class~=not-prose] *)) {
  color: inherit
}

.prose :where(pre):not(:where([class~=not-prose] *)) {
  background-color: transparent;
  border-radius: .375rem;
  color: currentColor;
  font-size: .875em;
  font-weight: 400;
  line-height: 1.7142857;
  margin: 0;
  overflow-x: auto;
  padding: 0
}

.prose :where(pre code):not(:where([class~=not-prose] *)) {
  background-color: transparent;
  border-radius: 0;
  border-width: 0;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  padding: 0
}

.prose :where(pre code):not(:where([class~=not-prose] *)):before {
  content: none
}

.prose :where(pre code):not(:where([class~=not-prose] *)):after {
  content: none
}

.prose :where(table):not(:where([class~=not-prose] *)) {
  font-size: .875em;
  line-height: 1.7142857;
  margin-bottom: 2em;
  margin-top: 2em;
  table-layout: auto;
  text-align: left;
  width: 100%
}

.prose :where(thead):not(:where([class~=not-prose] *)) {
  border-bottom-color: var(--tw-prose-th-borders);
  border-bottom-width: 1px
}

.prose :where(thead th):not(:where([class~=not-prose] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  padding-bottom: .5714286em;
  padding-left: .5714286em;
  padding-right: .5714286em;
  vertical-align: bottom
}

.prose :where(tbody tr):not(:where([class~=not-prose] *)) {
  border-bottom-color: var(--tw-prose-td-borders);
  border-bottom-width: 1px
}

.prose :where(tbody tr:last-child):not(:where([class~=not-prose] *)) {
  border-bottom-width: 0
}

.prose :where(tbody td):not(:where([class~=not-prose] *)) {
  vertical-align: baseline
}

.prose :where(tfoot):not(:where([class~=not-prose] *)) {
  border-top-color: var(--tw-prose-th-borders);
  border-top-width: 1px
}

.prose :where(tfoot td):not(:where([class~=not-prose] *)) {
  vertical-align: top
}

.prose {
  --tw-prose-body: #374151;
  --tw-prose-headings: #111827;
  --tw-prose-lead: #4b5563;
  --tw-prose-links: #111827;
  --tw-prose-bold: #111827;
  --tw-prose-counters: #6b7280;
  --tw-prose-bullets: #d1d5db;
  --tw-prose-hr: #e5e7eb;
  --tw-prose-quotes: #111827;
  --tw-prose-quote-borders: #e5e7eb;
  --tw-prose-captions: #6b7280;
  --tw-prose-code: #111827;
  --tw-prose-pre-code: #e5e7eb;
  --tw-prose-pre-bg: #1f2937;
  --tw-prose-th-borders: #d1d5db;
  --tw-prose-td-borders: #e5e7eb;
  --tw-prose-invert-body: #d1d5db;
  --tw-prose-invert-headings: #fff;
  --tw-prose-invert-lead: #9ca3af;
  --tw-prose-invert-links: #fff;
  --tw-prose-invert-bold: #fff;
  --tw-prose-invert-counters: #9ca3af;
  --tw-prose-invert-bullets: #4b5563;
  --tw-prose-invert-hr: #374151;
  --tw-prose-invert-quotes: #f3f4f6;
  --tw-prose-invert-quote-borders: #374151;
  --tw-prose-invert-captions: #9ca3af;
  --tw-prose-invert-code: #fff;
  --tw-prose-invert-pre-code: #d1d5db;
  --tw-prose-invert-pre-bg: rgba(0, 0, 0, .5);
  --tw-prose-invert-th-borders: #4b5563;
  --tw-prose-invert-td-borders: #374151;
  font-size: 1rem;
  line-height: 1.75
}

.prose :where(p):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.25em;
  margin-top: 1.25em
}

.prose :where(video):not(:where([class~=not-prose] *)) {
  margin-bottom: 2em;
  margin-top: 2em
}

.prose :where(figure):not(:where([class~=not-prose] *)) {
  margin-bottom: 2em;
  margin-top: 2em
}

.prose :where(li):not(:where([class~=not-prose] *)) {
  margin-bottom: .5em;
  margin-top: .5em
}

.prose :where(ol>li):not(:where([class~=not-prose] *)) {
  padding-left: .375em
}

.prose :where(ul>li):not(:where([class~=not-prose] *)) {
  padding-left: .375em
}

.prose :where(.prose>ul>li p):not(:where([class~=not-prose] *)) {
  margin-bottom: .75em;
  margin-top: .75em
}

.prose :where(.prose>ul>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.25em
}

.prose :where(.prose>ul>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.25em
}

.prose :where(.prose>ol>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.25em
}

.prose :where(.prose>ol>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.25em
}

.prose :where(ul ul,
  ul ol,
  ol ul,
  ol ol):not(:where([class~=not-prose] *)) {
  margin-bottom: .75em;
  margin-top: .75em
}

.prose :where(hr+*):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose :where(h2+*):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose :where(h3+*):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose :where(h4+*):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose :where(thead th:first-child):not(:where([class~=not-prose] *)) {
  padding-left: 0
}

.prose :where(thead th:last-child):not(:where([class~=not-prose] *)) {
  padding-right: 0
}

.prose :where(tbody td,
  tfoot td):not(:where([class~=not-prose] *)) {
  padding: .5714286em
}

.prose :where(tbody td:first-child,
  tfoot td:first-child):not(:where([class~=not-prose] *)) {
  padding-left: 0
}

.prose :where(tbody td:last-child,
  tfoot td:last-child):not(:where([class~=not-prose] *)) {
  padding-right: 0
}

.prose :where(.prose>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose :where(.prose>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 0
}

.prose-sm :where(.prose>ul>li p):not(:where([class~=not-prose] *)) {
  margin-bottom: .5714286em;
  margin-top: .5714286em
}

.prose-sm :where(.prose>ul>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.1428571em
}

.prose-sm :where(.prose>ul>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.1428571em
}

.prose-sm :where(.prose>ol>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.1428571em
}

.prose-sm :where(.prose>ol>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.1428571em
}

.prose-sm :where(.prose>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose-sm :where(.prose>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 0
}

.prose-base :where(.prose>ul>li p):not(:where([class~=not-prose] *)) {
  margin-bottom: .75em;
  margin-top: .75em
}

.prose-base :where(.prose>ul>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.25em
}

.prose-base :where(.prose>ul>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.25em
}

.prose-base :where(.prose>ol>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.25em
}

.prose-base :where(.prose>ol>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.25em
}

.prose-base :where(.prose>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose-base :where(.prose>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 0
}

.prose-lg :where(.prose>ul>li p):not(:where([class~=not-prose] *)) {
  margin-bottom: .8888889em;
  margin-top: .8888889em
}

.prose-lg :where(.prose>ul>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.3333333em
}

.prose-lg :where(.prose>ul>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.3333333em
}

.prose-lg :where(.prose>ol>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.3333333em
}

.prose-lg :where(.prose>ol>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.3333333em
}

.prose-lg :where(.prose>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose-lg :where(.prose>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 0
}

.prose-xl :where(.prose>ul>li p):not(:where([class~=not-prose] *)) {
  margin-bottom: .8em;
  margin-top: .8em
}

.prose-xl :where(.prose>ul>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.2em
}

.prose-xl :where(.prose>ul>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.2em
}

.prose-xl :where(.prose>ol>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.2em
}

.prose-xl :where(.prose>ol>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.2em
}

.prose-xl :where(.prose>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose-xl :where(.prose>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 0
}

.prose-2xl :where(.prose>ul>li p):not(:where([class~=not-prose] *)) {
  margin-bottom: .8333333em;
  margin-top: .8333333em
}

.prose-2xl :where(.prose>ul>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.3333333em
}

.prose-2xl :where(.prose>ul>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.3333333em
}

.prose-2xl :where(.prose>ol>li>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 1.3333333em
}

.prose-2xl :where(.prose>ol>li>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 1.3333333em
}

.prose-2xl :where(.prose>:first-child):not(:where([class~=not-prose] *)) {
  margin-top: 0
}

.prose-2xl :where(.prose>:last-child):not(:where([class~=not-prose] *)) {
  margin-bottom: 0
}

.v-theme--dark .prose {
  --tw-prose-body: var(--tw-prose-invert-body);
  --tw-prose-headings: var(--tw-prose-invert-headings);
  --tw-prose-lead: var(--tw-prose-invert-lead);
  --tw-prose-links: var(--tw-prose-invert-links);
  --tw-prose-bold: var(--tw-prose-invert-bold);
  --tw-prose-counters: var(--tw-prose-invert-counters);
  --tw-prose-bullets: var(--tw-prose-invert-bullets);
  --tw-prose-hr: var(--tw-prose-invert-hr);
  --tw-prose-quotes: var(--tw-prose-invert-quotes);
  --tw-prose-quote-borders: var(--tw-prose-invert-quote-borders);
  --tw-prose-captions: var(--tw-prose-invert-captions);
  --tw-prose-code: var(--tw-prose-invert-code);
  --tw-prose-pre-code: var(--tw-prose-invert-pre-code);
  --tw-prose-pre-bg: var(--tw-prose-invert-pre-bg);
  --tw-prose-th-borders: var(--tw-prose-invert-th-borders);
  --tw-prose-td-borders: var(--tw-prose-invert-td-borders)
}

@-webkit-keyframes blink {
  to {
      visibility: hidden
  }
}

@keyframes blink {
  to {
      visibility: hidden
  }
}

.animate-flash {
  -webkit-animation: flash 2s steps(60, start);
  animation: flash 2s steps(60, start)
}

@-webkit-keyframes flash {
  0% {
      background-color: hsla(0, 0%, 100%, .4)
  }
}

@keyframes flash {
  0% {
      background-color: hsla(0, 0%, 100%, .4)
  }
}

.pulse {
  animation: pulseEffect 2s ease-in-out 0s alternate infinite;
  --pulse-color: #8ab4f8;
  --pulse-color2: blue;
}

@keyframes pulseEffect {
  0% {
      filter: drop-shadow(0 0 50px var(--pulse-color))
  }

  to {
      filter: drop-shadow(0 0 25px var(--pulse-color2))
  }
}

.result-streaming>:not(ol):not(ul):not(pre):last-child:after,
.result-streaming>ol:last-child li:last-child:after,
.result-streaming>pre:last-child code:after,
.result-streaming>ul:last-child li:last-child:after {
  -webkit-animation: blink 1s steps(5, start) infinite;
  animation: blink 1s steps(5, start) infinite;
  content: "▋";
  margin-left: .25rem;
  vertical-align: baseline
}

#page-controls a {
  color: #aaa;
}

#page-controls a:hover {
  color: #000;
}

.v-theme--dark #page-controls a {
  color: rgba(255, 255, 255, 0.2);
}

.v-theme--dark #page-controls a:hover {
  color: #fff;
}

.v-skeleton-loader__chip {
  margin: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}

.v-skeleton-loader>div {
  max-width: 100%;
}
</style>