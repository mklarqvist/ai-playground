import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {...components, VSkeletonLoader},
    directives,
    ssr: true,
    // add theme
    theme: {
      defaultTheme: LIGHT_THEME,
      themes: {
        light,
        dark,
      },
    },
  });

  app.vueApp.use(vuetify);
});