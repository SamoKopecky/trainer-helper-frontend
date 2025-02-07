<script setup lang="ts">
import { ref } from "vue"
import "vue-cal/dist/vuecal.css"
import VueCal from "vue-cal"
import { type Event } from "../types/event"
import { getTimeslots } from "../backend-helpers/timeslots"
import type { Timeslot } from "../backend-helpers/timeslots"
import { useRouter } from "vue-router"

const router = useRouter()
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
    return event
  })
  events.value = abc
})

function onEventClick(event: Event, e: any) {
  selectedEvent.value = event
  showDialog.value = true
  router.push({ path: "about" })

  e.stopPropagation()
}
</script>

<template>
  <vue-cal
    :events="events"
    style="height: 100%"
    :on-event-click="onEventClick"
    :disable-views="['years', 'year']"
    :time-from="15 * 60"
    :time-to="22 * 60"
    :time-step="30"
  ></vue-cal>

  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <v-card-text>
          <p>{{ selectedEvent?.title }}</p>
          <RouterLink to="/about?id=1">Session link</RouterLink>
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<style></style>
