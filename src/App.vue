<script setup lang="ts">
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useTheme } from "vuetify"
import { capitalizeWords } from "./utils/user"
import { useUser } from "@/composables/useUser"
import { computed } from "vue"

const keycloak = useKeycloak()
const drawer = ref(false)
const route = useRoute()
const theme = useTheme()
const { isTrainer } = useUser()
const athleteIdPath = computed(() => {
  const athleteBasePath = "/athlete"
  // If use is not trainer, redirect him to his blocks/weeks straight away
  return !isTrainer.value ? `${athleteBasePath}/${keycloak.subject}` : athleteBasePath
})

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
    <v-navigation-drawer v-model="drawer" :width="220">
      <v-list-item link title="Trainer Helper" to="/" />
      <v-divider />
      <v-list-item link title="Athlete Info" prepend-icon="mdi-account" :to="athleteIdPath" />
      <v-list-item link title="Calendar" prepend-icon="mdi-calendar" to="/calendar" />
      <v-list-item
        v-if="isTrainer"
        link
        title="Athletes"
        prepend-icon="mdi-account-multiple"
        to="/athleteList"
      />
      <v-list-item
        v-if="isTrainer"
        link
        title="Exercise Types"
        prepend-icon="mdi-weight-lifter"
        to="/exerciseType"
      />
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
