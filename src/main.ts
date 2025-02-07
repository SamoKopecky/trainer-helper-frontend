import { createApp } from "vue"

import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as directives from "vuetify/directives"
import { VCalendar } from "vuetify/labs/VCalendar"
import App from "./App.vue"
import {
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
  VSpacer,
} from "vuetify/components"
import router from "./router"

const vuetify = createVuetify({
  components: {
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
    VCardText,
    VIcon,
    VSpacer,
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
