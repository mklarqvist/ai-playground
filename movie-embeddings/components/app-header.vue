<template>
    <div>
        <v-app-bar style="color:white;"
            :style="props.color ? `background-color: rgba(${props.color.DarkVibrant.rgb[0]},${props.color.DarkVibrant.rgb[1]},${props.color.DarkVibrant.rgb[2]}, 1)` : 'inherit'">
            <v-app-bar-nav-icon>
                <img src="/assets/movie_2x_logo.svg" height="36" />
            </v-app-bar-nav-icon>
            <v-app-bar-title style="flex: inherit;margin-inline-start:8px;-webkit-margin-start: 8px;" class="mr-4">
                <nuxt-link to="/">FlickFinder</nuxt-link>
            </v-app-bar-title>

            <!-- Search bar -->
            <v-text-field v-model="search" hide-details prepend-inner-icon="mdi-magnify" single-line placeholder="Search"
                @keyup.enter="searchMovie(search)"></v-text-field>


            <v-spacer></v-spacer>

            <!-- Links -->
            <nuxt-link to="https://www.github.com/mklarqvist">
                <v-btn icon>
                    <v-icon>mdi-github</v-icon>
                </v-btn>
            </nuxt-link>

            <nuxt-link to="https://www.twitter.com/marcusklarqvist">
                <v-btn icon>
                    <v-icon>mdi-twitter</v-icon>
                </v-btn>
            </nuxt-link>

        </v-app-bar>
    </div>
</template>

<script setup>
const props = defineProps({
    color: {
        type: Object, // A colorPalette
        required: false
    },
});

const search = ref('');
const searchMovie = (query) => {
    if (query) {
        navigateTo(`/search/${query}`)
    }
}
</script>

<style scoped>
.v-toolbar {
    background-color: black;
}
</style>