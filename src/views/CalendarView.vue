<script setup lang="ts">
import { ref } from "vue"
import "vue-cal/dist/vuecal.css"
import VueCal from "vue-cal"
import { type CalendarEvent, type Timeslot } from "@/types"
import { TimeslotService } from "@/services/timeslots"
import type { TimeslotPostRequest } from "@/services/timeslots"
import { useRouter } from "vue-router"

const router = useRouter()
const selectedEvent = ref<CalendarEvent | null>(null)
const showDialog = ref(false)
const events = ref<Array<CalendarEvent>>([])
const timeslotService = new TimeslotService()
const request: TimeslotPostRequest = {
  start_date: "2025-01-20T12:00:00",
  end_date: "2026-02-28T20:15:00",
}

function addMinutes(date: Date, minutes: number): Date {
  const msToAdd = minutes * 60 * 1000
  return new Date(date.getTime() + msToAdd)
}

timeslotService.post(request).then((timeslots) => {
  events.value = timeslots.map((timeslot: Timeslot) => {
    const event: CalendarEvent = {
      start: timeslot.start.toString(),
      end: addMinutes(timeslot.start, timeslot.duration).toString(),
      title: timeslot.id.toString(),
      content: `trainer id: ${timeslot.trainer_id}`,
      timeslot_id: timeslot.id,
    }
    return event
  })
})

function onEventClick(event: CalendarEvent, e: Event) {
  router.push({ path: `/exercise/${event.timeslot_id}` })

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
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<style></style>
