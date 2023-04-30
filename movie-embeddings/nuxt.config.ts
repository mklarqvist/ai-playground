import vuetify from "vite-plugin-vuetify";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// PWA Config
const title = "Movie similarity app with Nuxt3 + Vuetify";
const shortTitle = "Movie similarity app";
const description =
  "Demo project for launching your own movie similarity app.";
const image = "https://s3.amazonaws.com/images.seroundtable.com/google-logo-exploding-1681647430.jpg";
const url = "https://github.com/mklarqvist/ai-playground/";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  nitro: {
    experimental: {
      wasm: true
    }
  },
  buildModules: [
    'nuxt-vite',
  ],
  vite: {
    plugins: [
      wasm(), topLevelAwait(),
    ],
    ssr: true, // enable unstable server-side rendering for development (false by default)
    // experimentWarning: false // hide experimental warning message (disabled by default for tests)
  },
  // import styles
  // css: ["@/assets/main.scss"],
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/main.scss",
  ],
  // enable takeover mode
  // typescript: { shim: false },
  build: { transpile: ["vuetify"] },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    "@kevinmarrec/nuxt-pwa",
    '@nuxtjs/google-fonts',
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        // @ts-ignore
        config.plugins.push(vuetify())
      );
    },
  ],
  googleFonts: {
    families: {
      "Inter": {
        wght: [400, 500, 600, 700, 800],
        ital: [400, 500, 600, 700, 800],
      },
    },
  },
  app: {
    head: {
      title: "Vuetify 3 + Nuxt 3 Starter",
      titleTemplate: "%s | Vuetify 3 + Nuxt 3 Starter",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: url },
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content: description,
        },
        { property: "og:site_name", content: title },
        { hid: "og:type", property: "og:type", content: "website" },
        {
          hid: "og:url",
          property: "og:url",
          content: url,
        },
        {
          hid: "og:image:secure_url",
          property: "og:image:secure_url",
          content: image,
        },
        {
          hid: "og:title",
          property: "og:title",
          content: title,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: description,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: image,
        },
        //Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: url,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: title,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: description,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: image,
        },
      ],
    },
  },

  pwa: {
    meta: {
      name: shortTitle,
      author: "M. D. R. Klarqvist",
      theme_color: "#4f46e5",
      description: description,
    },
    manifest: {
      name: shortTitle,
      short_name: shortTitle,
      theme_color: "#4f46e5",
      description: description,
    },
  },
});
