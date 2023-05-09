<template>
  <div>
    <!-- App bar -->
    <app-header :color="colorPalette"></app-header>
    <!-- Body -->
    <section class="inner_content">
      <div class="header large first"
        :style="movieData ? `background-image: url('https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${movieData.backdrop_path}')` : ''">
        <div class="keyboard_s py-12"
          :style="colorPalette ? `background-image: linear-gradient(to right, rgba(${colorPalette.DarkVibrant.rgb[0]},${colorPalette.DarkVibrant.rgb[1]},${colorPalette.DarkVibrant.rgb[2]}, 1) calc((50vw - 170px) - 340px), rgba(${colorPalette.DarkVibrant.rgb[0]},${colorPalette.DarkVibrant.rgb[1]},${colorPalette.DarkVibrant.rgb[2]}, 0.84) 50%, rgba(${colorPalette.DarkVibrant.rgb[0]},${colorPalette.DarkVibrant.rgb[1]},${colorPalette.DarkVibrant.rgb[2]}, 0.84) 100%)` : 'background-image: linear-gradient(to right, rgb(4, 36, 60) calc(-510px + 50vw), rgba(4, 36, 60, 0.84) 50%, rgba(4, 36, 60, 0.84) 100%)'">
          <v-container>
            <div class="d-flex">
              <div style="width:300px">
                <template v-if="movieData">
                  <v-img class="poster lazyload lazyloaded"
                    :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path}`"
                    :data-src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path}`"
                    :data-srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movieData.poster_path} 2x`"
                    :srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movieData.poster_path} 2x`"
                    :alt="movieData.original_title" width="300px">
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                  <nuxt-link to="#">
                    <div>
                      <div class="d-flex justify-center py-2"
                        style="background: linear-gradient(145deg,#000,#222); border-bottom-left-radius: 24px; border-bottom-right-radius: 24px;line-height: 1.2;">
                        <div class="mr-4">
                          <img height="36" src="/assets/amazon_prime_video_logo_white.svg" />
                        </div>
                        <div>
                          <div style="color: rgba(255,255,255,0.8)">Now Streaming</div>
                          <div><strong>Watch Now</strong></div>
                        </div>
                      </div>
                    </div>
                  </nuxt-link>
                </template>
              </div>
              <div class="me-auto ml-10 py-4">
                <template v-if="movieData">
                  <h2 id="movie-title"><nuxt-link to="#">{{ movieData.original_title }}</nuxt-link></h2>
                  <p id="movie-tagline" class="my-8">{{ movieData.tagline }}</p>
                  <div>
                    <p id="movie-synopsis">{{ movieData.overview }}</p>
                  </div>
                  <v-breadcrumbs>
                    <v-breadcrumbs-item><template v-slot:divider>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                      </template><v-chip label class="ma-1"
                        :color="colorPalette ? `rgb(${colorPalette.LightVibrant.rgb[0]},${colorPalette.LightVibrant.rgb[1]},${colorPalette.LightVibrant.rgb[2]})` : 'primary'"
                        text-color="white">PG-13</v-chip></v-breadcrumbs-item>
                    <v-breadcrumbs-item><template v-slot:divider>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                      </template>{{ dateToPretty(movieData.release_date) }} ({{
                        getPreferredCountry(movieData.production_countries) }})
                    </v-breadcrumbs-item>
                    <v-breadcrumbs-item><template v-slot:divider>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                      </template>
                      <nuxt-link to="#" v-for="(genre, index) in movieData.genres">{{ genre.name
                      }}</nuxt-link></v-breadcrumbs-item>
                    <v-breadcrumbs-item><template v-slot:divider>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                      </template> {{ minutesToHours(movieData.runtime) }}</v-breadcrumbs-item>
                  </v-breadcrumbs>

                  <!-- <div v-if="directorData">
                      <v-row class="my-4">
                        <v-col cols="6" v-for="(person, index) in directorData.slice(0, 6)">
                          <div><nuxt-link to="#"><strong>{{ person.name }}</strong></nuxt-link></div>
                          <div>{{ person.job }}</div>
                        </v-col>
                      </v-row>
                  </div> -->

                  <div>
                    <v-btn style="
  -webkit-transition: background 100ms,opacity 100ms;
  transition: background 100ms,opacity 100ms;
  border: none;
  outline: none;
  cursor: pointer;
  line-height: 1;
  color: #081118;
  /* background: linear-gradient(145deg,#00e18c,#00e36a); */
  border-radius: 24px;
  -webkit-letter-spacing: 1px;
  -moz-letter-spacing: 1px;
  -ms-letter-spacing: 1px;
  letter-spacing: 0px;
  font-size: 14px;
  padding: 16px 20px;
  height: 48px;
  min-width: 228px;
  border-radius: 5px;
  margin-right: 16px;"
                      :style="{ background: colorPalette ? `linear-gradient(145deg,rgb(${colorPalette.LightVibrant.rgb[0]},${colorPalette.LightVibrant.rgb[1]},${colorPalette.LightVibrant.rgb[2]}),rgb(${colorPalette.Vibrant.rgb[0]},${colorPalette.Vibrant.rgb[1]},${colorPalette.Vibrant.rgb[2]})` : 'primary' }">
                      <v-icon class="mr-1">mdi-play</v-icon>Watch Now</v-btn>

                    <v-btn style="-webkit-transition: background 100ms,opacity 100ms;
  transition: background 100ms,opacity 100ms;
  border: none;
  outline: none;
  cursor: pointer;
  line-height: 1;
  color: #081118;
  /* background: linear-gradient(145deg,#00e18c,#00e36a); */
  border-radius: 24px;
  -webkit-letter-spacing: 1px;
  -moz-letter-spacing: 1px;
  -ms-letter-spacing: 1px;
  letter-spacing: 0px;
  font-size: 14px;
  padding: 16px 20px;
  height: 48px;
  min-width: 228px;
  border-radius: 5px;
  margin-right: 16px;background: rgba(255,255,255,0.5);"><v-icon class="mr-1">mdi-plus</v-icon>Save for later</v-btn>
                  </div>

                </template>
              </div>
            </div>
          </v-container>
        </div>
      </div>
    </section>
    <v-container>
      <div class="d-flex">
        <div class="me-auto">
          <!-- Actors etc -->
          <template v-if="creditsData">
            <h3 class="mb-4 mt-4">Top Billed Cast</h3>
            <v-row>
              <v-col cols="2" v-for="(actor, index) in creditsData.cast.slice(0, 6)">
                <v-card style="height:100%;" elevation="3">
                  <v-img v-if="actor.profile_path" loading="lazy" class="profile"
                    :src="`https://www.themoviedb.org/t/p/w276_and_h350_face/${actor.profile_path}`"
                    :srcset="`https://www.themoviedb.org/t/p/w138_and_h175_face/${actor.profile_path} 1x, https://www.themoviedb.org/t/p/w276_and_h350_face/${actor.profile_path} 2x`"
                    :alt="actor.name">
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                  <div class="ma-4">
                    <div><strong><nuxt-link to='#'>{{ actor.name }}</nuxt-link></strong></div>
                    <div>{{ actor.character }}</div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </div>
        <div style="min-width: 260px;
  width: 260px;" class="pl-4">
          <template v-if="movieData">
            <p><strong>Status</strong> {{ movieData.status }}</p>
            <p><strong>Budget</strong> {{ costPretty(movieData.budget) }}</p>
            <p v-if="movieData.revenue > 0"><strong>Revenue</strong> {{ costPretty(movieData.revenue) }}</p>
            <p><strong>IMDB</strong> {{ movieData.imdb_id }}</p>
          </template>
        </div>
      </div>

    </v-container>

    <!-- Similar -->
    <div class="mx-8 mt-12">
      <h3 class="mb-4"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="my-auto"
          height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z">
          </path>
        </svg>
        Movies that have similar synopsis</h3>
      <v-row>
        <template v-for="(movie, idx) in similarSynopsis.value">
        <v-col cols="6" sm="4" md="2" v-if="movie.posterPath">
          <!-- <pre>{{idx}}: {{ movie }}</pre> -->
          <v-card style="position: relative;" class="image-transition" @click="openDialogSynopsis(movie.id, movie.posterPath, movie.title, localMovieDetails.data.synopsisSimilarOffsetQuery[idx], localMovieDetails.data.synopsisSimilarOffsetReference[idx])">
            <template v-if="similarSynopsis">
              <v-img class="poster lazyload lazyloaded"
                :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath}`"
                :data-src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath}`"
                :data-srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.posterPath} 2x`"
                :srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.posterPath} 2x`"
                :alt="movie.title" width="100%">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </template>
            <div style="position: absolute; bottom: .25rem; right: .25rem;background-color: black;padding-left: .5rem;
padding-right: .5rem;color:white;"><span>{{ idx + 1 }}</span></div>
          </v-card>
        </v-col>
      </template>
      </v-row>



      <h3 class="mb-4 mt-12"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16"
          class="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z">
          </path>
        </svg>
        Movies that have similar poster content (not visuals)</h3>
      <v-row>
        <template v-if="localMovieDetails">
          <v-col cols="6" sm="4" md="2" v-for="(similarId, idx) in localMovieDetails.data.visualSimilarMovieId">
          <nuxt-link :to="`/movie/${similarId}`">
            <v-card style="position: relative;" class="image-transition">
            <!-- {{ similarId }}, {{ idx }}, {{ localMovieDetails.data.visualSimilarPaths[idx] }} -->
            <v-img class="poster lazyload lazyloaded"
                :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${localMovieDetails.data.visualSimilarPaths[idx]}`"
                :data-src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${localMovieDetails.data.visualSimilarPaths[idx]}`"
                :data-srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${localMovieDetails.data.visualSimilarPaths[idx]} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${localMovieDetails.data.visualSimilarPaths[idx]} 2x`"
                :srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${localMovieDetails.data.visualSimilarPaths[idx]} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${localMovieDetails.data.visualSimilarPaths[idx]} 2x`"
                alt="2xAI" width="100%">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
              <div style="position: absolute; bottom: .25rem; right: .25rem;background-color: black;padding-left: .5rem;
padding-right: .5rem;color:white;"><span>{{ idx + 1 }}</span></div>
          </v-card>
        </nuxt-link>
        </v-col>
        </template>
      </v-row>

      <template v-if="imagesData">
        <div class="mt-16">
          <h3 class="mb-4"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16"
              class="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z">
              </path>
            </svg> Images</h3>
          <v-row>
            <v-col cols="2" v-for="(image, index) in imagesData.backdrops" class="fill-height">
              <v-card class="image-transition">
                <v-img loading="lazy" :src="`https://www.themoviedb.org/t/p/w276_and_h350_face/${image.file_path}`"
                  :srcset="`https://www.themoviedb.org/t/p/w138_and_h175_face/${image.file_path} 1x, https://www.themoviedb.org/t/p/w276_and_h350_face/${image.file_path} 2x`"
                  alt="Paul Rudd" :alt="image.original_title" data-loaded="true"
                  @click="setDialogImage(`https://www.themoviedb.org/t/p/w1280/${image.file_path}`)">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </template>

      <div class="mt-12">
        <template v-if="videosData">
          <h3 class="mb-4"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16"
              class="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z">
              </path>
            </svg> Images</h3>
          <v-row>
            <v-col cols="6" v-for="(video, index) in videosData.results">
              <iframe width="100%" height="400px" :src="`https://www.youtube.com/embed/${video.key}`" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </v-col>
          </v-row>
        </template>
      </div>

    </div>

    <app-footer></app-footer>

    <!-- image dialog -->
    <template v-if="movieData">
      <dialog-text-comparison :title="movieData.original_title" :queryTitle="queryTitle" :queryPosterPath="queryPosterPath"
        :referencePosterPath="movieData.poster_path" :dialogSynopsis="dialogSynopsis" :queryText="queryText"
        :referenceText="referenceText" :referenceMovieId="movieData.id" :queryMovieId="queryMovieId"
        @close-panel="closeDialogSynopsis()">
      </dialog-text-comparison>
    </template>

  </div>
</template>
  
<script setup>
import * as Vibrant from 'node-vibrant'

const queryPosterPath = ref(null);
const queryMovieId = ref(null);
const queryTitle = ref(null);

const movieData = ref(null);
const creditsData = ref(null)
const imagesData = ref(null)
const videosData = ref(null)
const directorData = ref(null)
const apiKey = 'YOUR_API_KEY'
const colorPalette = ref(null)

const dialog = ref(false);
const dialogImage = ref(null);
const dialogSynopsis = ref(false);

const queryText = ref('');
const referenceText = ref('');

const setDialogImage = (image) => {
  dialog.value = true;
  dialogImage.value = image
}

const openDialogSynopsis = async (movieId, posterPath, posterTitle, qOffset, rOffset) => {
  queryPosterPath.value = posterPath;
  queryMovieId.value = movieId;
  queryTitle.value = posterTitle

  // localhost:3000/api/pairedChunks
  const { data, error } = await useFetch('/api/pairedChunks', {
    method: 'POST',
    body: {
      id: [qOffset, rOffset]
    }
  })
  if (error.value) console.log('ERROR from useFetch: ', error.value)
  if (data.value) {
    // Super important:
    // Sort the API response to make sure it matches our indices
    const sortOrder = [qOffset, rOffset];
    data.value.sort(function (a, b) {
      return sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id);
    });

    queryText.value = data.value[0].text
    referenceText.value = data.value[1].text
  }

  dialogSynopsis.value = true;
}

const closeDialogSynopsis = () => {
  dialogSynopsis.value = false;
  // queryText.value = '';
  // referenceText.value = '';
}

const fetchMovieDetails = async (id) => {
  try {
    const [detailsResponse, creditsResponse, imagesResponse, videosResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
    ])

    const ldetailsData = await detailsResponse.json()
    const lcreditsData = await creditsResponse.json()
    const limagesResponse = await imagesResponse.json()
    const lvideosResponse = await videosResponse.json()

    movieData.value = ldetailsData;
    creditsData.value = lcreditsData;
    imagesData.value = limagesResponse;
    videosData.value = lvideosResponse;

    const directors = lcreditsData.crew.filter((member) => member.job === 'Director' || member.job === 'Novel' || member.job === 'Screenplay' || member.job === 'Writer')

    directorData.value = directors

    // Promise
    Vibrant.from(`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movieData.value.poster_path}?not-from-cache-please`).getPalette()
      .then((palette) => colorPalette.value = palette).catch((error) => console.log('error getting palette: ', error))

  } catch (error) {
    console.error('Error fetching movie details:', error)
  }
}

const localMovieDetails = ref(null);



const fetchMovieDetailsLocal = async (id) => {
  // api call (async implied in this context)
  // this call is a GET by default
  const ret = await useFetch(`/api/movie/${id}`).then((data) => {
    localMovieDetails.value = data
    // console.log('data returned from useFetch: ', localMovieDetails.value)
  }).catch((error) => {
    console.log('ERROR from useFetch: ', error)
  })
}

// const similarPosterPaths = ref(null);
const similarSynopsis = ref(null);

const fetchMovieSimilarLocal = async (ids) => {
  const { data, error } = await useFetch('/api/similarSynopsis', {
    method: 'POST',
    body: {
      ids: ids
    }
  })
  if (error.value) console.log('ERROR from useFetch: ', error.value)
  if (data.value) {
    // console.log('data returned from useFetch: ', data)
    similarSynopsis.value = data;

    // Super important:
    // Sort the API response to make sure it matches our indices
    const sortOrder = localMovieDetails.value.data.synopsisSimilarMovieId;
    similarSynopsis.value.value.sort(function (a, b) {
      return sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id);
    });
  }
}

const minutesToHours = (minutes) => {
  const hours = Math.floor(Math.floor(minutes) / 60) // Inner float in case the value is a string
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const dateToPretty = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

const dateToPrettyYear = (date) => {
  const options = { year: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

// Cost to a pretty string but dropping cents
const costPretty = (cost) => {
  return cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3)
}

function getPreferredCountry(countries) {
  const preferredCountry = countries.find(country => country.iso_3166_1 === 'US') || countries[0];
  return preferredCountry.iso_3166_1;
}

const route = useRoute();

onMounted(() => {
  fetchMovieDetails(route.params.id);
})

await fetchMovieDetailsLocal(route.params.id)
await fetchMovieSimilarLocal(localMovieDetails.value.data.synopsisSimilarMovieId)


</script>

<style scoped>
.v-responsive__sizer {
  padding-bottom: 100%;
}

div.header.large.first {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0% 0%;
}

div.header.large.first {
  width: 100%;
  position: relative;
  z-index: 1;
}

div.header {
  background: linear-gradient(to bottom right, rgba(31.5, 31.5, 94.5, 1), rgba(31.5, 31.5, 94.5, 0.84));
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: linear-gradient(to right bottom, rgb(32, 32, 95), rgba(32, 32, 95, 0.84));
  background-size: auto;
}

/* section.inner_content div.custom_bg {
    background-image: linear-gradient(to right, rgba(52.5, 10.5, 10.5, 1) calc((50vw - 170px) - 340px), rgba(52.5, 10.5, 10.5, 0.84) 50%, rgba(52.5, 10.5, 10.5, 0.84) 100%)
  } */

div.custom_bg {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

section.inner_content {
  color: white;
}

div.scroller_wrap::after {
  transition: linear 0.3s;
  opacity: 1;
}

div.scroller_wrap::after {
  content: '';
  width: 60px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #fff 100%);
  will-change: opacity;
  pointer-events: none;
}


h2#movie-title {
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-size: 3.75rem;
  line-height: 110%;
  letter-spacing: -.03em;
  font-weight: 400;
}

h2#movie-title a {
  color: white;
  opacity: 1.0;
}

h2#movie-title a:hover {
  opacity: 0.8;
}

p#movie-tagline {
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-size: 1.3rem;
  line-height: 1.1;
  font-style: italic;
  opacity: 0.8;
}

#movie-synopsis {
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-size: 1.2rem;
  line-height: 1.35;
  /* line-height: 100%; */
}

.image-transition {
  opacity: 0.9;
}

.image-transition:hover {
  transition-property: transform;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
  opacity: 1;
  transform: matrix(1.1, 0, 0, 1.1, 0, 0);
}


</style>