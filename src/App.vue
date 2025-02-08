<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"

const drawer = ref(false)
const route = useRoute()
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list-item link title="Home" to="/"> </v-list-item>
      <v-list-item link title="Time schedule" to="/calendar"> </v-list-item>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ route.name }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div>
        <RouterView />
      </div>
    </v-main>
  </v-app>
</template>

<style></style>
