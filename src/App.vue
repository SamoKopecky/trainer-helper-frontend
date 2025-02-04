<script setup lang="ts">
import { ref } from "vue"
import "vue-cal/dist/vuecal.css"
import VueCal from "vue-cal"
import { type Event } from "./events/event"
import { getTimeslots } from "./backend-helpers/timeslots"
import type { Timeslot } from "./backend-helpers/timeslots"

const drawer = ref(false)
const selectedEvent = ref<Event | null>(null)
const showDialog = ref(false)
const events = ref<Array<Event>>([])

function addMinutes(date: Date, minutes: number): Date {
  const msToAdd = minutes * 60 * 1000
  return new Date(date.getTime() + msToAdd)
}

getTimeslots().then((timeslots) => {
  const abc = timeslots.map((timeslot: Timeslot) => {
    const event: Event = {
      start: timeslot.start.toString(),
      end: addMinutes(timeslot.start, timeslot.duration).toString(),
      title: timeslot.id,
      content: `trainer id: ${timeslot.trainer_id}`,
    }
    console.log(event)
    return event
  })
  events.value = abc
})

function onEventClick(event: Event, e: any) {
  selectedEvent.value = event
  showDialog.value = true

  e.stopPropagation()
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
        <vue-cal :events="events" style="height: 100%" :on-event-click="onEventClick"></vue-cal>
      </div>
    </v-main>
  </v-app>

  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <v-card-text>
          <p>{{ selectedEvent?.title }}</p>
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<style></style>
