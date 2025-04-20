<script setup lang="ts">
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useTheme } from "vuetify"
import { capitalizeWords } from "./utils/user"
import { useUser } from "@/composables/useUser"

const keycloak = useKeycloak()
const drawer = ref(false)
const route = useRoute()
const theme = useTheme()
const { isTrainer } = useUser()

function LogOut() {
  if (keycloak && keycloak.logoutFn) {
    keycloak.logoutFn()
  }
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark"
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list-item link title="Home" to="/" />
      <v-list-item v-if="isTrainer" link title="Athletes" to="/athleteList" />
      <v-list-item link title="Time schedule" to="/calendar" />
      <v-list-item v-if="isTrainer" link title="Exercise types" to="/exerciseType" />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>{{ route.name }}</v-app-bar-title>

      <v-btn @click="toggleTheme" x-large icon="mdi-theme-light-dark" class="mr-2" />
      <span class="font-weight-medium" style="margin-right: 0.25rem">{{
        capitalizeWords(keycloak.fullName)
      }}</span>
      <v-icon style="margin-right: 0.5rem">mdi-account</v-icon>
      <v-btn text="Logout" style="margin-right: 1rem" @click="LogOut" />
    </v-app-bar>
    <v-main>
      <div>
        <RouterView />
      </div>
    </v-main>
  </v-app>
</template>

<style></style>
