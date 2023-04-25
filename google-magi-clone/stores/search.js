import { defineStore } from 'pinia'

export const searchHistoryStore = defineStore('searchHistory', {
  id: "searchHistory",
    state: () => ({
    searchHistory: [], // History of queries
    searchResponses: [], // History of responses from the search engine
    searchChatResponses: [], // History of responses from the chat engine based on the search engine results and the query
  }),

  actions: {
    clear() {
      this.searchHistory = [];
      this.searchResponses = [];
      this.searchChatResponses = [];
    },
},
persist: {
    storage: persistedState.localStorage,
  },
})

