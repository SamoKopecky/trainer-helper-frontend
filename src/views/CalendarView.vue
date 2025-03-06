<script setup lang="ts">
import { ref } from "vue"
import "vue-cal/style"
import { VueCal } from "vue-cal"
import { type CalendarEvent, type Timeslot } from "@/types"
import { TimeslotService } from "@/services/timeslots"
import type { TimeslotGetRequest } from "@/services/timeslots"
import { useRouter } from "vue-router"
import { useChangeEvents } from "@/composables/useChangeEvents"
import { CalendarChange, CalendarChangeEvent } from "@/utils/changeEvent"

const router = useRouter()
const selectedEvent = ref<CalendarEvent | null>(null)
const showDialog = ref(false)
const events = ref<Array<CalendarEvent>>([])
const timeslotService = new TimeslotService()
const request: TimeslotGetRequest = {
  start_date: "2025-01-20T12:00:00",
  end_date: "2026-02-28T20:15:00",
}
const { addChangeEvent, popChangeEvent } = useChangeEvents()

function addMinutes(date: Date, minutes: number): Date {
  const msToAdd = minutes * 60 * 1000
  return new Date(date.getTime() + msToAdd)
}

timeslotService.get(request).then((timeslots) => {
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

const onEventClick = (data: { e: Event; event: CalendarEvent }) => {
  selectedEvent.value = data.event
  showDialog.value = true
}

function redirectExercise(event: CalendarEvent | null) {
  router.push({ path: `/exercise/${event?.timeslot_id}` })
}

function deleteExercise(event: CalendarEvent | null) {
  if (!event) {
    return
  }
  console.log("Delete!", event)
  showDialog.value = false
  const changeEvent = new CalendarChangeEvent(event, events.value, CalendarChange.DELETE)
  addChangeEvent(changeEvent)
}

const createEvent = ({ event, resolve }) => {
  console.log("create")
  const newEvent = {
    ...event,
    title: "new event",
    timeslot_id: "42",
  }
  resolve(newEvent)
  const changeEvent = new CalendarChangeEvent(newEvent, events.value, CalendarChange.CREATE)
  addChangeEvent(changeEvent)
}

const undoClick = () => {
  popChangeEvent()
}
</script>

<template>
  <vue-cal
    dark
    editable-events
    :snap-to-interval="30"
    :events="events"
    @cell-click="false"
    style="height: 100%"
    @event-click="onEventClick"
    @event-create="createEvent"
    :views="['day', 'week', 'month', 'year']"
    :time-from="8 * 60"
    :time-to="22 * 60"
    :time-step="30"
  ></vue-cal>

  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <v-card-text>
          <p>Event titled {{ selectedEvent?.title }}</p>
          <v-btn text="Go exericse" @click="redirectExercise(selectedEvent)" />
          <v-btn text="Delete timeslot" @click="deleteExercise(selectedEvent)" />
          <v-btn text="undo" @click="undoClick" />
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<style>
.vuecal--default-theme .vuecal__cell--selected::before {
  background-color: transparent;
}
</style>
