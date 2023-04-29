<template>
  <div>
    <section class="inner_content">
      <div class="header large border first"
        :style="movieData ? `background-image: url('https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${movieData.backdrop_path}')` : ''">
        <div class="keyboard_s custom_bg">
          <v-container>
            <div class="d-flex">
              <div style="width:300px">
                <template v-if="movieData">
                  <img class="poster lazyload lazyloaded"
                    :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path}`"
                    :data-src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path}`"
                    :data-srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movieData.poster_path} 2x`"
                    :srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieData.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movieData.poster_path} 2x`"
                    :alt="movieData.original_title" data-loaded="true">
                </template>
              </div>
              <div class="me-auto ml-10 py-4">
                <template v-if="movieData">
                  <h2><nuxt-link to="#">{{ movieData.original_title }}</nuxt-link> ({{ movieData.release_date }})</h2>
                  <v-breadcrumbs>
                    <v-breadcrumbs-item><template v-slot:divider>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                      </template><v-chip label class="ma-1" color="primary"
                        text-color="white">PG-13</v-chip></v-breadcrumbs-item>
                    <v-breadcrumbs-item><template v-slot:divider>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                      </template>{{ dateToPretty(movieData.release_date) }} ({{
                        movieData.production_countries[0].iso_3166_1 }})
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
                  <div>
                    <p style="font-style: italic;">{{ movieData.tagline }}</p>
                    <h3 class="mt-4 mb-1">Overview</h3>
                    <p>{{ movieData.overview }}</p>
                  </div>
                  <div>
                    <template v-if="directorData">
                      <v-row class="my-4">
                        <v-col cols="6" v-for="(person, index) in directorData.slice(0, 6)">
                          <div><nuxt-link to="#">{{ person.name }}</nuxt-link></div>
                          <div>{{ person.job }}</div>
                        </v-col>
                      </v-row>
                    </template>
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
          <template v-if="creditsData">
            <h3>Top Billed Cast</h3>
            <v-row class="fill-height">
              <v-col cols="2" v-for="(actor, index) in creditsData.cast.slice(0, 6)">
                <v-card style="height:100%;" elevation="3">
                  <v-img v-if="actor.profile_path" loading="lazy" class="profile"
                    :src="`https://www.themoviedb.org/t/p/w276_and_h350_face/${actor.profile_path}`"
                    :srcset="`https://www.themoviedb.org/t/p/w138_and_h175_face/${actor.profile_path} 1x, https://www.themoviedb.org/t/p/w276_and_h350_face/${actor.profile_path} 2x`"
                    alt="Paul Rudd"></v-img>
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
            <p><strong>Revenue</strong> {{ costPretty(movieData.revenue) }}</p>
            <p><strong>IMDB</strong> {{ movieData.imdb_id }}</p>
          </template>
        </div>
      </div>

      <template v-if="imagesData">
        <div class="mt-16">
          <h3>Images</h3>
          <v-row>
            <v-col cols="2" v-for="(image, index) in imagesData.backdrops" class="fill-height">
              <v-card>
                <v-img loading="lazy" :src="`https://www.themoviedb.org/t/p/w276_and_h350_face/${image.file_path}`"
                  :srcset="`https://www.themoviedb.org/t/p/w138_and_h175_face/${image.file_path} 1x, https://www.themoviedb.org/t/p/w276_and_h350_face/${image.file_path} 2x`"
                  alt="Paul Rudd" :alt="image.original_title" data-loaded="true"
                  @click="setDialogImage(`https://www.themoviedb.org/t/p/w1280/${image.file_path}`)"></v-img>
              </v-card>
            </v-col>
          </v-row>
        </div>
        </template>

      <div>
        <template v-if="videosData">
          <h3>Videos</h3>
          <v-row>
            <v-col cols="6" v-for="(video, index) in videosData.results">
              <iframe width="100%" height="400px"  :src="`https://www.youtube.com/embed/${video.key}`" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </v-col>
        </v-row>
        </template>
      </div>

      <div>
        <h3>Similar movies</h3>
      </div>
    </v-container>
    <v-footer :elevation="0" class="mt-16" style="background-color: black;color:white;">
      <v-container class="py-16">

        this is the footer
      </v-container>
    </v-footer>
    <!-- dialog -->
    <div class="text-center">
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <div style="position: relative;">
            <div class="d-flex">
              <div class="me-auto">
                <v-img loading="lazy" :src="dialogImage" aspect-ratio="16/9" cover style="width:100vh"></v-img>
              </div>
              <div style="width: 150px;">
                right
              </div>
            </div>
            <v-btn color="primary" variant="text" @click="dialog = false" style="position: absolute;top:5px;right:5px;"><v-icon>mdi-close</v-icon></v-btn>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
const movieData = ref(null);
const creditsData = ref(null)
const imagesData = ref(null)
const videosData = ref(null)
const directorData = ref(null)
const apiKey = 'YOUR_API_KEY_HERE'

const dialog = ref(false);
const dialogImage = ref(null);

const setDialogImage = (image) => {
  dialog.value = true;
  dialogImage.value = image
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

  } catch (error) {
    console.error('Error fetching movie details:', error)
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

// Cost to a pretty string but dropping cents
const costPretty = (cost) => {
  return cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3)
}


fetchMovieDetails(550);

</script>

<style>
.v-responsive__sizer {
  padding-bottom: 100%;
}

div.header.large.first {
  background-size: cover;
  background-repeat: no-repeat;
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

section.inner_content div.custom_bg {
  background-image: linear-gradient(to right, rgba(52.5, 10.5, 10.5, 1) calc((50vw - 170px) - 340px), rgba(52.5, 10.5, 10.5, 0.84) 50%, rgba(52.5, 10.5, 10.5, 0.84) 100%)
}

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
</style>