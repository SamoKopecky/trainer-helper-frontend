import { createApp } from "vue"

import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as directives from "vuetify/directives"
import App from "./App.vue"
import { createPinia } from "pinia"
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
  VList,
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
  VToolbar,
  VToolbarTitle,
  VDatePicker,
  VCombobox,
  VMenu,
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VExpandTransition,
} from "vuetify/components"
import router from "./router"
import VueKeyCloak from "@dsb-norge/vue-keycloak-js"
import { tokenInterceptor } from "./services/base"
import { VDateInput } from "vuetify/labs/components"

const vuetify = createVuetify({
  components: {
    VDatePicker,
    VCombobox,
    VToolbar,
    VToolbarTitle,
    VExpandTransition,
    VFab,
    VSheet,
    VCardText,
    VExpansionPanel,
    VExpansionPanels,
    VExpansionPanelText,
    VExpansionPanelTitle,
    VListItem,
    VList,
    VNavigationDrawer,
    VMenu,
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
    VDateInput,
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

const pinia = createPinia()
const viteKeycloakUrl = import.meta.env.VITE_APP_KEYCLOAK_URL ?? "http://localhost:8080"
const app = createApp(App)
app
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(VueKeyCloak, {
    config: {
      url: viteKeycloakUrl,
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
