<script setup lang="ts">
import { ref } from "vue"
import "vue-cal/style"
import { VueCal } from "vue-cal"
import { TimeslotService } from "@/services/timeslots"
import type { TimeslotGetRequest } from "@/services/timeslots"
import { useChangeEvents } from "@/composables/useChangeEvents"
import type { AppTimeslot, CalTimeslot } from "@/types/calendar"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot, VueCalRef } from "@/types/vuecal"
import type { Timeslot } from "@/types/other"
import { useEventDialog } from "@/composables/useEventDialog"
import EventDialog from "@/components/EventDialog.vue"
import { CalendarCreateEvent } from "@/changeEvents/calendarCreate"

const timeslotService = new TimeslotService()
const request: TimeslotGetRequest = {
  start_date: "2025-01-20T12:00:00",
  end_date: "2026-02-28T20:15:00",
}
const { addChangeEvent, popChangeEvent } = useChangeEvents()
const { showDialog, selectedEvent } = useEventDialog()
const vueCalRef = ref<VueCalRef | null>()
const events = ref<Array<CalTimeslot>>([])

function addMinutes(date: Date, minutes: number): Date {
  const msToAdd = minutes * 60 * 1000
  return new Date(date.getTime() + msToAdd)
}

timeslotService.get(request).then((timeslots) => {
  timeslots.forEach((timeslot: Timeslot) => {
    if (!vueCalRef.value) {
      throw new Error("Invalid vueCalRef")
    }
    vueCalRef.value.view.createEvent({
      start: new Date(timeslot.start.toString()),
      end: new Date(addMinutes(timeslot.start, timeslot.duration).toString()),
      title: timeslot.id.toString(),
      content: `trainer id: ${timeslot.trainer_id}`,
      timeslot_id: timeslot.id,
    } as AppTimeslot)
  })
})

function onCalTimeslotClick(data: { e: Event; event: CalTimeslot }) {
  selectedEvent.value = data.event
  showDialog.value = true
}

function deleteCalTimeslot(event: CalTimeslot | null) {
  if (event) {
    timeslotService.delete({ timeslot_id: event.timeslot_id }).then(() => event.delete(3))
  }
  showDialog.value = false
}

function createCalTimeslot(data: {
  event: UnresolvedVueCalTimeslot
  resolve: (event: UnresolvedCalTimeslot) => void
}) {
  const changeEvent = new CalendarCreateEvent(data.event)
  addChangeEvent<Timeslot>(changeEvent).then((res) => {
    const unresolved: UnresolvedCalTimeslot = {
      ...data.event,
      title: res.id.toString(),
      content: `trainer id: ${res.trainer_id}`,
      timeslot_id: res.id,
    }
    data.resolve(unresolved)
    changeEvent.resolvedTimeslot = unresolved as CalTimeslot
  })
}
</script>

<template>
  <v-btn text="undo" @click="popChangeEvent" style="margin: 10px" />
  <VueCal
    dark
    style="height: 100%"
    ref="vueCalRef"
    :editable-events="{ create: true, resize: false, drag: true, delete: true }"
    :events="events"
    :snap-to-interval="30"
    :views="['day', 'week', 'month', 'year']"
    :time-from="8 * 60"
    :time-to="22 * 60"
    :time-step="30"
    @event-click="onCalTimeslotClick"
    @event-create="createCalTimeslot"
  ></VueCal>

  <EventDialog
    :selected-event="selectedEvent"
    @delete-cal-timeslot="deleteCalTimeslot"
    v-model="showDialog"
  >
  </EventDialog>
</template>

<style>
.vuecal--default-theme .vuecal__cell--selected::before {
  background-color: transparent;
}
</style>
