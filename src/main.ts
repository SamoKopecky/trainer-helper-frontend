import { createApp } from "vue"

import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as directives from "vuetify/directives"
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
  VDataTable,
  VTextarea,
  VCardActions,
  VBtnToggle,
  VFileInput,
  VForm,
  VCheckbox,
  VTooltip,
  VChip,
  VFab,
  VSheet,
} from "vuetify/components"
import router from "./router"
import VueKeyCloak from "@dsb-norge/vue-keycloak-js"
import { tokenInterceptor } from "./services/base"

const vuetify = createVuetify({
  components: {
    VFab,
    VSheet,
    VCardText,
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
    VDataTable,
    VTextarea,
    VCardActions,
    VBtnToggle,
    VFileInput,
    VForm,
    VCheckbox,
    VTooltip,
    VChip,
  },
  directives,
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "dark",
  },
})

const VITE_KEYCLOAK_URL = import.meta.env.VITE_APP_KEYCLOAK_URL ?? "http://localhost:8080"
const app = createApp(App)
app
  .use(router)
  .use(vuetify)
  .use(VueKeyCloak, {
    config: {
      url: VITE_KEYCLOAK_URL,
      realm: "trainer-helper",
      clientId: "trainer-helper",
    },
    init: {
      onLoad: "login-required",
      silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
    },
    onReady: () => {
      tokenInterceptor()
      app.mount("#app")
    },
  })
