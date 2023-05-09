<template>
    <div>
        <v-footer :elevation="0" class="mt-16">
      <v-container class="py-16">

        <div class="d-flex">
          <div style="width:150px">
            <nuxt-link to="https://github.com/2x-ai"><img src="/assets/2x_logo_white.svg" alt="2xAI logo"
                height="48" /></nuxt-link>
          </div>
          <div class="me-auto pl-4">
            <nuxt-link to="https://twitter.com/marcusklarqvist"><v-icon>mdi-twitter</v-icon></nuxt-link>
            <nuxt-link to="https://twitter.com/twoxAI"><v-icon>mdi-twitter</v-icon></nuxt-link>
            <nuxt-link to="https://github.com/2x-ai"><v-icon>mdi-github</v-icon></nuxt-link>
            <nuxt-link to="https://github.com/mklarqvist"><v-icon>mdi-github</v-icon></nuxt-link>
          </div>
        </div>
        Data sources are: <nuxt-link to="https://www.themoviedb.org/">TMDb</nuxt-link>, <nuxt-link
          to="https://www.imdb.com/">IMDb</nuxt-link>, <nuxt-link to="https://www.wikipedia.org/">Wikipedia</nuxt-link>,
        <nuxt-link to="https://themoviespoiler.com/">The Movie Spoiler</nuxt-link>. Copyrights and all other rights belong
        to their respective owner.
      </v-container>
    </v-footer>
    </div>
</template>

<script setup>

</script>

<style>
.v-footer {
  color: rgba(255, 255, 255, 0.7);
  background-color: black;
}

.v-footer a {
  text-decoration: underline;
  color: rgba(255, 255, 255, 0.7);
}

.v-footer a:hover {
  opacity: 1;
}
</style>