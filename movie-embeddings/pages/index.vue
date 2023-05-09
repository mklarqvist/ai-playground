<template>
    <div>
        <!-- App bar -->
        <app-header></app-header>
        <div style="background-color: black;color:white;" class="py-16">
            <v-container>
                <div class="d-flex">
                    <div class="mr-4" style="min-width:128px"><img src="/assets/movie_2x_logo.svg" height="128" /></div>
                    <div class="me-auto">
                    <h6 class="pb-6">AI Computer Vision and Foundational Large Language Models</h6>
                    <h1><span class="text-5xl">FlickFinder: Artificial Intelligence Movie Recommendation Service</span></h1>
                    <h6 class="py-6">A family of foundation models producing <strong>universal features</strong> suitable
                        for <strong>image-level visual tasks</strong> (image classification, instance retrieval, video
                        understanding) as well as <strong>pixel-level visual tasks</strong> (depth estimation, semantic
                        segmentation).</h6>
                    <div class="flex items-center pb-10 mt-5 font-bold text-center text-white cursor-pointer"><svg
                            stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="mr-2"
                            height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z">
                            </path>
                        </svg><span class="normal-case hover:opacity-70">Try the demos</span></div>
                    <div class="md:w-full lg:w-2/3"></div>
                </div>
                </div>
            </v-container>
        </div>
    <div>top movies</div>
    <h1>defualt movies page</h1>
    <!-- App bar -->
    <app-footer></app-footer>
</div></template>

<script setup>

</script>

<style lang="scss" scoped></style>