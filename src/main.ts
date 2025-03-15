import { createApp } from "vue"

import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as directives from "vuetify/directives"
import { VCalendar } from "vuetify/labs/VCalendar"
import App from "./App.vue"
import {
  VAlert,
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VCard,
  VCardText,
  VCardTitle,
  VDialog,
  VIcon,
  VListItem,
  VMain,
  VNavigationDrawer,
  VSlideYTransition,
  VSpacer,
  VAutocomplete,
  VBtn,
  VDivider,
  VRow,
  VCol,
  VTextField,
  VContainer,
} from "vuetify/components"
import router from "./router"

const vuetify = createVuetify({
  components: {
    VCardText,
    VCalendar,
    VListItem,
    VNavigationDrawer,
    VAppBarNavIcon,
    VAppBarTitle,
    VAppBar,
    VMain,
    VApp,
    VDialog,
    VCard,
    VCardTitle,
    VIcon,
    VSpacer,
    VAlert,
    VSlideYTransition,
    VAutocomplete,
    VBtn,
    VDivider,
    VRow,
    VCol,
    VTextField,
    VContainer,
  },
  directives,
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "dark",
  },
})

createApp(App).use(router).use(vuetify).mount("#app")
