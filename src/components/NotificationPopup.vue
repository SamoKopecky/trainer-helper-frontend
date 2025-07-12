<script setup lang="ts">
import { useNotificationStore } from "@/stores/useNotificationStore"

const { notifications } = useNotificationStore()
</script>

<template>
  <div class="notification-container">
    <v-slide-y-transition group>
      <v-alert
        v-for="notification in notifications"
        :key="notification[0]"
        class="top-alert"
        closable
        :type="notification[1].type"
        >{{ notification[1].text }}</v-alert
      >
    </v-slide-y-transition>
  </div>
</template>

<style>
/* This container is now fixed to the viewport */
.notification-container {
  position: fixed; /* This is the key change */
  top: 10px; /* Distance from the top of the screen */
  right: 20px; /* Distance from the right of the screen */
  z-index: 9999; /* High z-index to ensure it's on top of all other content */
  width: auto; /* Let the width be determined by its content */
  max-width: 500px; /* Optional: prevent it from becoming too wide on small alerts */
}

/* Style for each individual alert inside the container */
.top-alert {
  /* No position, top, or right needed here anymore */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;

  /* Add a margin to create space between stacked notifications */
  margin-bottom: 10px;
}
</style>
