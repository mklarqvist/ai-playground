<template>
    <div>
        <!-- <pre>{{ searchResults }}</pre> -->
        <template v-if="searchResults">
        <template v-if="searchResults.data.length === 0">
            <v-card>
                <v-card-title>
                    <h2>No results found for {{ route.params.query }}</h2>
                </v-card-title>
            </v-card>
          </template>
          <template v-else>
        <v-card v-for="(movie, idx) in searchResults.data">
          <nuxt-link :to="`/movie/${movie.id}`">{{ movie.title }} ({{ movie.releaseYear }}})</nuxt-link>
          <nuxt-link :to="`/movie/${movie.id}`"><v-img class="poster lazyload lazyloaded"
                    :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath}`"
                    :data-src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath}`"
                    :data-srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.posterPath} 2x`"
                    :srcset="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.posterPath} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.posterPath} 2x`"
                    :alt="movie.title" width="300px">
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                </nuxt-link>
        </v-card>
      </template>
    </template>
    </div>
</template>

<script setup>
const route = useRoute()
const searchResults = ref(null);

const searchMovie = async (query) => {
  try {
    const ret = await useFetch(`/api/search/${query}`).then((data) => {
        searchResults.value = data
        console.log('data returned from useFetch: ', searchResults.value)
    }).catch((error) => {
        console.log('ERROR from useFetch: ', error)
    })

  } catch (error) {
    console.error('Error fetching movie details:', error)
  }
}

await searchMovie(route.params.query);

</script>

<style scoped>

</style>