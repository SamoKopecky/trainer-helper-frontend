<script setup lang="ts">
import { ref } from "vue"
import { getTimeslots, type Timeslot } from "./backend-helpers/timeslots.ts"

const drawer = ref(false)
const events = ref<any>([])

const data = ref<Timeslot | null>(null)

getTimeslots().then((res) => (data.value = res[0]))

const customEvents = []
customEvents.push({
  title: "abc",
  start: new Date(),
  end: new Date(),
  color: "blue",
  allDay: false,
})
events.value = customEvents
function onEventClick() {
  console.log("clicked")
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list-item link title="Time schedule"></v-list-item>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>App name</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <div>
        <v-calendar :events="events" @click:day="onEventClick"></v-calendar>
      </div>
    </v-main>
  </v-app>
</template>

<style></style>
