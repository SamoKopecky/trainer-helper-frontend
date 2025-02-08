<script setup lang="ts">
import { ref } from "vue"
import "vue-cal/dist/vuecal.css"
import VueCal from "vue-cal"
import { type Event } from "../types/event"
import { TimeslotConnector } from "../backend-helpers/timeslots"
import type { Timeslot, TimeslotPost } from "../backend-helpers/timeslots"
import { useRouter } from "vue-router"

const router = useRouter()
const selectedEvent = ref<Event | null>(null)
const showDialog = ref(false)
const events = ref<Array<Event>>([])
const timeslot_fetcher = new TimeslotConnector()
const request: TimeslotPost = {
  start_date: "2025-01-20T12:00:00",
  end_date: "2025-02-28T20:15:00",
}

function addMinutes(date: Date, minutes: number): Date {
  const msToAdd = minutes * 60 * 1000
  return new Date(date.getTime() + msToAdd)
}

timeslot_fetcher.post(request).then((timeslots) => {
  events.value = timeslots.map((timeslot: Timeslot) => {
    const event: Event = {
      start: timeslot.start.toString(),
      end: addMinutes(timeslot.start, timeslot.duration).toString(),
      title: timeslot.id.toString(),
      content: `trainer id: ${timeslot.trainer_id}`,
    }
    return event
  })
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
    :time-from="8 * 60"
    :time-to="22 * 60"
    :time-step="30"
  ></vue-cal>

  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <v-card-text>
          <p>{{ selectedEvent?.title }}</p>
          <RouterLink to="/about">Session link</RouterLink>
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<style></style>
