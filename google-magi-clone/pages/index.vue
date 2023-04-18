<!-- Interesting edge case bug for our Markdown parser -->
<!-- What HTML tag did Marc Andreessen propose?  -->
<template>
  <div class="d-flex pt-1 px-4" id="page-controls">
    <v-switch inset color="info" v-model="darkMode" @change="toggleTheme()" prepend-icon="mdi-moon-waxing-crescent"
      append-icon="mdi-white-balance-sunny" style="display: inherit;"></v-switch>

    <nuxt-link to="https://twitter.com/MarcusKlarqvist"><v-btn
        variant='text'><v-icon size="28">mdi-twitter</v-icon></v-btn></nuxt-link>
    <nuxt-link to="https://github.com/mklarqvist/ai-playground"><v-btn variant='text'><v-icon size="28">mdi-github</v-icon></v-btn></nuxt-link>
  </div>

  <v-container class="google-container">
      <v-form @submit.prevent id="search-input" class="pulse">
        <v-textarea clearable id="chat-textarea" v-model="chatTextArea" rows="1" auto-grow hide-details="auto"
          color="blue" variant="solo" @keypress.enter="(event) => clickAsk(event)">
          <template v-slot:prepend-inner>
            <img src="/google_logo.svg" height="24" alt="Google Logo" class="mr-2" />
          </template>
        </v-textarea>

      </v-form>
      <h1 class="search-family-types-header">Filters and Topics</h1>
      <v-chip-group class="search-family-types my-2">
        <v-chip variant="outlined"><v-icon class="mr-1">mdi-image-outline</v-icon>Images</v-chip>
        <v-chip variant="outlined"><v-icon class="mr-1">mdi-newspaper-variant</v-icon>News</v-chip>
        <v-chip variant="outlined"><v-icon class="mr-1">mdi-tag-outline</v-icon>Shopping</v-chip>
        <v-chip variant="outlined"><v-icon class="mr-1">mdi-play-box-outline</v-icon>Video</v-chip>
      </v-chip-group>
      <v-divider></v-divider>


    <div class="chat-responses mt-3">
      <div v-if="messages.length > 1" v-for="(message, idx) in messages.slice(-1)" :key="`message-${idx}`">
        <VueShowdown :ref="`chat-msg-${idx}`" class="markdown-body prose"
          :class="isStreaming ? 'result-streaming' : ''" flavor="github"
          :options="{ emoji: true }" :markdown="message.content">
        </VueShowdown>
      </div>
    </div>
    <div class="mb-4 mt-1 d-flex justify-end" v-if="hasFinished">
      <v-btn variant="text"><v-icon>mdi-thumb-up-outline</v-icon></v-btn>
      <v-btn variant="text"><v-icon>mdi-thumb-down-outline</v-icon></v-btn>
    </div>

    <!-- Read more section -->
    <div v-if="hasSearched">
      <h4 class="my-3 search-read-more">Read more</h4>
      <v-row class="mb-2">
        <v-col cols="4" v-for="idx in 3">

          <v-card class="mx-auto" max-width="400" fill-height>
            <v-img class="align-end text-white" height="100" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover>
            </v-img>

            <div class="pa-4">
              <div class="search-result-meta d-flex">
                <span class="fav-icon-container"><img src="/google_logo.svg" height="18" alt="Google Logo" /></span>
                <div class="d-flex flex-column">
                  <div class="search-result-meta-title">og:title</div>
                </div>
              </div>
              <nuxt-link to="https://www.google.com">
                <h4 class="search-result-title mt-2 mb-1">og:title {{ idx }}</h4>
              </nuxt-link>
              <div class="search-result-description">og:description...</div>
            </div>
          </v-card>

        </v-col>
      </v-row>

      <!-- Similar questions section -->
      <v-chip-group>
        <v-chip v-for="i in 4" variant="outlined">similar question {{ i }}</v-chip>
      </v-chip-group>
    </div>
  </v-container>

  <!-- Search results -->
  <v-divider :thickness="10" class="mt-4 mb-1"></v-divider>

  <v-container class="google-container" style="min-height:500px;">

    <template v-if="isScraping">
    <v-skeleton-loader v-for="skeleton in 6" type="article"></v-skeleton-loader>
  </template>
    <template v-if="ret">
      <transition-group name="slide-in" :style="{ '--total': ret.value.api.length }" tag="div">
        <div class="search-result" v-for="(document, did) in ret.value.api" :key="`dix-${did}`" :style="{ '--i': did + 1 }"
          v-if="showItems">
          <div class="d-flex">
            <div class="me-auto">
              <nuxt-link :to="document.metadata.url">
                <div class="search-result-meta d-flex">
                  <span class="fav-icon-container"><img v-if="document.metadata.favicon != 'N/A'"
                      :src="validFavIconLink(document.metadata.favicon, document.metadata.url)" height="18"
                      alt="" /></span>
                  <div class="d-flex flex-column">
                    <div class="search-result-meta-title">{{ document.metadata.og_title }}</div>
                    <div class="search-result-meta-url">{{ document.metadata.url }}</div>
                  </div>
                </div>

                <h3 class="search-result-title mt-2 mb-1">{{ document.metadata.page_title }}</h3>
              </nuxt-link>
              <div class="search-result-description">{{ document.metadata.og_desc }}</div>
            </div>
            <!-- If there is an image -->
            <div v-if="document.metadata.og_image != 'N/A'" class="ml-4">
              <v-img style="border-radius: 24px;border:1px solid #dadce0;" class="bg-white" width="200" :aspect-ratio="1"
                :src="document.metadata.og_image" alt="" cover></v-img>
            </div>
          </div>
        </div>
      </transition-group>
    </template>

  </v-container>
</template>

<script setup>
import { fetchStreamedChat, fetchStreamedChatContent } from '~/server/streamer';
import { VueShowdown } from "vue-showdown";
import { useTheme } from "vuetify";

// CHANGE THIS API KEY WITH YOUR OWN
const apiKey = 'YOUR-OWN-API-KEY';

const ret = ref(null);
const showItems = ref(false);

const messages = ref([
  { role: 'system', content: 'You are a helpful assistant and epxert communicator with exceptional story-telling skills that answer questions with as many details as possible.' },
]);

const chatTextArea = ref(null);
const isStreaming = ref(false);
const isScraping = ref(false);
const hasSearched = ref(false);
const hasFinished = ref(false);

const theme = useTheme();
const darkMode = ref(false);

const toggleTheme = () => {
  theme.global.name.value = darkMode.value ? "dark" : "light";
};


async function clickAsk(event) {
  if (event) {
    event.preventDefault()
  }

  if (chatTextArea.value.length == 0) {
    return;
  }

  showItems.value = false;
  isScraping.value = true;
  // Promise chain
  useFetch(`/api/scrape/${encodeURIComponent(chatTextArea.value)}`)
    .then(({ data }) => (ret.value = data))
    .finally(() => { showItems.value = true; isScraping.value = false; })
  messages.value.push({ role: 'user', content: chatTextArea.value + ' Give me as much details as possible.' });
  await askFakeMagi();
}

async function askFakeMagi() {
  messages.value.push({ role: 'system', content: '' });
  isStreaming.value = true;
  hasSearched.value = true;
  hasFinished.value = false;
  await fetchStreamedChat({
    apiKey,
    messageInput: messages.value,
    maxTokens: 1000,
    temperature: 0.025,
    fetchTimeout: 10000,
  }, (responseChunk) => {
    // get the actual content from the JSON
    const content = JSON.parse(responseChunk).choices[0].delta.content;
    if (content) {
      messages.value.at(-1).content += content;
    }
  })
  hasFinished.value = true;
  isStreaming.value = false;
}

function validFavIconLink(url, src) {
  var pattern = /^((http|https|ftp):\/\/)/;
  if (!pattern.test(url)) {
    const { protocol, hostname } = new URL(src);
    url = protocol + '//' + hostname + url;
  }
  return url;
}

</script>

<style lang="scss">
.slide-in {

  &-move {
    transition: opacity .5s linear, transform .5s ease-in-out;
  }

  &-leave-active {
    transition: opacity 0.4s linear, transform .4s cubic-bezier(.5, 0, .7, .4); //cubic-bezier(.7,0,.7,1); 
    transition-delay: calc(0.2s * (var(--total) - var(--i)));
  }

  &-enter-active {
    transition: opacity 0.4s linear, transform .5s cubic-bezier(.2, .5, .1, 1);
    transition-delay: calc(0.2s * var(--i));
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &-enter-from {
    transform: translateX(-1em);
  }

  &-leave-to {
    transform: translateX(1em);
  }

}


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
  --search-result-color: #202124;;
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
  --chip-border: 1px solid rgba(255,255,255,0.2);
  --chip-border-icon-color: #fff;
}

.search-family-types > .v-chip {
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
  filter:drop-shadow(0 0 50px var(--pulse-color))
 }
 to {
  filter:drop-shadow(0 0 25px var(--pulse-color2))
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
  color: rgba(255,255,255,0.2);
}
.v-theme--dark #page-controls a:hover {
  color: #fff;
} 
</style>