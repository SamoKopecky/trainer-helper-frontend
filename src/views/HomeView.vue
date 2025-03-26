<script setup lang="ts">
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"

const keycloak = useKeycloak()
</script>

<template>
  <h1>Home</h1>
  <v-btn @click="console.log(keycloak.token)">token</v-btn>
</template>
