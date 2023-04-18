# Google "Magi" clone with Nuxt3 + Vuetify

Google made a recent announcement (as of yesterday when writing this) unveiling a new project called "Magi." This initiative aims to integrate advanced large-language models with their search capabilities. As there is no public demo available for review, I've decided to create a clone inspired by the image provided below:

![Google Magi](github/google_magi.gif)

And this is what we came up with:

![Google Magi Clone Dark](github/google_magi_clone.gif)

and light mode

![Google Magi Clone Light](github/google_magi_clone_light.gif)

## Known issues

Because of excessive scraping, my IP has been banned for a few hours? days?

* The Related cards section is unfinished — as in the scraping to fill in real values is missing.
* Similar questions is unfinished — for the same reason.

## How to use

0. Open `pages/index.vue` and enter your own OpenAPI key where it says `const apiKey = 'YOUR-OWN-API-KEY';`.

1. Install the dependencies

```bash
npm install
```

2. Run the app

```bash
npm run dev --
```

That's it.