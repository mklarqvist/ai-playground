<template>
    <!-- dialog text similarity -->
    <div class="text-center">
        <v-dialog v-model="props.dialogSynopsis" width="auto" @keydown.esc="togglePanel()">
            <v-card>
                <div style="position: relative;">
                    <v-row style="border: 1px solid rgba(0,0,0,0.2);margin: 20px 0;">
                        <v-col md="2" cols="3" style="border-right: 1px solid rgba(0,0,0,0.2);padding: 0;">
                            <v-img class="poster lazyload lazyloaded"
                                :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.referencePosterPath}`"
                                :data-src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.referencePosterPath}`"
                                :data-srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.referencePosterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${props.referencePosterPath} 2x`"
                                :srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.referencePosterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${props.referencePosterPath} 2x`"
                                :alt="title" width="100%">
                                <template v-slot:placeholder>
                                    <div class="d-flex align-center justify-center fill-height">
                                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                    </div>
                                </template>
                            </v-img>
                        </v-col>
                        <v-col md="4" cols="3" style="border-right: 1px solid rgba(0,0,0,0.2);" class="pa-4">
                            <h3>{{ props.title }}</h3>
                            <div class="mb-2">Matching synopsis section (could be truncated):</div>
                            <word-animator :inputText="props.referenceText"></word-animator>
                            <div class="mt-2">
                                Source: <img src="/assets/imdb_logo.png" alt="IMDb logo" height="15">
                            </div>
                        </v-col>
                        <v-col md="4" cols="3" style="border-right: 1px solid rgba(0,0,0,0.2);" class="pa-4">
                            <h3>{{ props.queryTitle }}</h3>
                            <div class="mb-2">Matching synopsis section (could be truncated):</div>
                            <word-animator :inputText="props.queryText"></word-animator>
                            <div class="mt-2">
                                Source: <img src="/assets/imdb_logo.png" alt="IMDb logo" height="15">
                            </div>

                        </v-col>
                        <v-col md="2" cols="3" style="padding: 0;">
                            <nuxt-link :to="`/movie/${queryMovieId}`">
                            <v-img class="poster lazyload lazyloaded"
                                :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.queryPosterPath}`"
                                :data-src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.queryPosterPath}`"
                                :data-srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.queryPosterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${props.queryPosterPath} 2x`"
                                :srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${props.queryPosterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${props.queryPosterPath} 2x`"
                                :alt="title" width="100%">
                                <template v-slot:placeholder>
                                    <div class="d-flex align-center justify-center fill-height">
                                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                    </div>
                                </template>
                            </v-img>
                            <v-btn style="
  -webkit-transition: background 100ms,opacity 100ms;
  transition: background 100ms,opacity 100ms;
  border: none;
  outline: none;
  cursor: pointer;
  line-height: 1;
  color: #fff;
  background: linear-gradient(145deg,#000,#333);
  border-radius: 24px;
  -webkit-letter-spacing: 1px;
  -moz-letter-spacing: 1px;
  -ms-letter-spacing: 1px;
  letter-spacing: 1px;
  font-size: 14px;
  padding: 16px 20px;
  height: 48px;
width: 100%;
border-radius: 0;
border-bottom-left-radius: 24px;
 border-bottom-right-radius: 24px;
">
  <v-icon class="mr-2">mdi-movie-filter-outline</v-icon>Visit</v-btn>
</nuxt-link>
                        </v-col>
                    </v-row>

                    <v-btn color="black" variant="text" @click="togglePanel()"
                        style="position: absolute;top:5px;right:5px;background-color: rgba(0,0,0,0.25)"><v-icon>mdi-close</v-icon></v-btn>
                    
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    queryTitle: {
        type: String,
        required: true
    },
    queryPosterPath: {
        type: String,
        required: true
    },
    referencePosterPath: {
        type: String,
        required: true
    },

    dialogSynopsis: Boolean,
    queryText: {
        type: String,
        required: true
    },
    referenceText: {
        type: String,
        required: true
    },
    referenceMovieId: {
        type: Number,
        required: true
    },
    queryMovieId: {
        type: Number,
        required: true
    },
})

const emit = defineEmits(['closePanel'])

function togglePanel() {
    console.log('clicked close panel')
    emit('closePanel')
}
</script>

<style scoped>
.v-responsive__sizer {
    padding-bottom: 100%;
}
</style>