<script setup lang="ts">
import { type ChangeNotification } from "@/types"

defineProps({
  notifications: {
    type: Map<string, ChangeNotification>,
    required: true,
  },
})
</script>

<template>
  <div class="notification">
    <v-slide-y-transition group>
      <v-alert
        v-for="notification in notifications"
        class="top-alert"
        closable
        :key="notification[0]"
        :type="notification[1].type"
        >{{ notification[1].text }}</v-alert
      >
    </v-slide-y-transition>
  </div>
</template>

<style>
.notification {
  position: relative; /* Make the container a positioned element */
}

.top-alert {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000; /* Ensure the alert is above other content */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  margin-top: 10px;
  max-width: 100%; /* Ensure it doesn't overflow the container */
  padding: 16px; /* Add padding for content spacing */
  background-color: #f0f0f0; /* Optional: Set a background color */
}
</style>
