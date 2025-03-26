<script setup lang="ts">
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { ref } from "vue"
import { useRoute } from "vue-router"

const keycloak = useKeycloak()
const drawer = ref(false)
const route = useRoute()

function LogOut() {
  if (keycloak && keycloak.logoutFn) {
    keycloak.logoutFn()
  }
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list-item link title="Home" to="/" />
      <v-list-item link title="Time schedule" to="/calendar" />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>{{ route.name }}</v-app-bar-title>
      <span style="margin-right: 1rem">{{ keycloak.fullName }}</span>
      <v-icon style="margin-right: 1rem">mdi-account</v-icon>
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
