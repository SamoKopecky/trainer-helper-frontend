<script setup lang="ts">
function handleClick() {
  console.log('clicked!')
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-btn color="primary" @click="handleClick"> Click Me </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>
