<script setup lang="ts">
import { ref } from "vue"
import "vue-cal/style"
import { VueCal } from "vue-cal"
import { type CalendarEvent, type NewCalendarEvent, type Timeslot } from "@/types"
import { TimeslotService } from "@/services/timeslots"
import type { TimeslotGetRequest } from "@/services/timeslots"
import { useRouter } from "vue-router"
import { useChangeEvents } from "@/composables/useChangeEvents"
import { CalendarCreateEvent } from "@/utils/changeEvent"

const router = useRouter()
const selectedEvent = ref<CalendarEvent | null>(null)
const showDialog = ref(false)
const timeslotService = new TimeslotService()
const request: TimeslotGetRequest = {
  start_date: "2025-01-20T12:00:00",
  end_date: "2026-02-28T20:15:00",
}
const { addChangeEvent, popChangeEvent } = useChangeEvents()
const events = ref<Array<CalendarEvent>>([])

function addMinutes(date: Date, minutes: number): Date {
  const msToAdd = minutes * 60 * 1000
  return new Date(date.getTime() + msToAdd)
}

timeslotService.get(request).then((timeslots) => {
  timeslots.forEach((timeslot: Timeslot) => {
    const event: CalendarEvent = {
      start: timeslot.start.toString(),
      end: addMinutes(timeslot.start, timeslot.duration).toString(),
      title: timeslot.id.toString(),
      content: `trainer id: ${timeslot.trainer_id}`,
      timeslot_id: timeslot.id,
    }
    events.value.push(event)
  })
})

function onEventClick(data: { e: Event; event: CalendarEvent }) {
  selectedEvent.value = data.event
  showDialog.value = true
}

function redirectExercise(event: CalendarEvent | null) {
  router.push({ path: `/exercise/${event?.timeslot_id}` })
}

function deleteExercise(event: CalendarEvent | null) {
  if (event) {
    timeslotService.delete({ timeslot_id: event.timeslot_id }).then(() => event.delete(3))
  }
  showDialog.value = false
}

function createEvent(data: { event: any; resolve: (event: unknown) => void }) {
  const newEvent: NewCalendarEvent = {
    ...data.event,
  }
  const changeEvent = new CalendarCreateEvent(newEvent)
  addChangeEvent(changeEvent).then((res: Timeslot) => {
    newEvent.title = res.id.toString()
    newEvent.content = `trainer id: ${res.trainer_id}`
    const completeEvent: CalendarEvent = {
      ...newEvent,
      timeslot_id: res.id,
    }
    data.resolve(completeEvent)
    changeEvent.createdEvent = completeEvent
  })
}
</script>

<template>
  <v-btn text="undo" @click="popChangeEvent" style="margin: 10px" />
  <VueCal
    dark
    editable-events
    :events="events"
    :snap-to-interval="30"
    style="height: 100%"
    @event-click="onEventClick"
    @event-create="createEvent"
    :views="['day', 'week', 'month', 'year']"
    :time-from="8 * 60"
    :time-to="22 * 60"
    :time-step="30"
  ></VueCal>

  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <v-card-text>
          <p>Event titled {{ selectedEvent?.title }}</p>
          <v-btn text="Go exericse" @click="redirectExercise(selectedEvent)" />
          <v-btn text="Delete timeslot" @click="deleteExercise(selectedEvent)" />
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
