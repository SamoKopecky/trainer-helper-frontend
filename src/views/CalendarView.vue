<script setup lang="ts">
import "vue-cal/style"
import { VueCal } from "vue-cal"
import { useChangeEvents } from "@/composables/useChangeEvents"
import { useEventDialog } from "@/composables/useEventDialog"
import EventDialog from "@/components/EventDialog.vue"
import { useCalendar } from "@/composables/useCalendar"

const { addChangeEvent, popChangeEvent } = useChangeEvents()
const { showDialog, selectedEvent } = useEventDialog()
const { events, vueCalRef, createTimeslot, deleteTimeslot, clickTimeslot, updateEventPerson } =
  useCalendar(selectedEvent, showDialog, addChangeEvent)
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
    :views="['day', 'week', 'month']"
    :time-from="8 * 60"
    :time-to="22 * 60"
    :time-step="30"
    @event-click="clickTimeslot"
    @event-create="createTimeslot"
  ></VueCal>

  <EventDialog
    :selected-event="selectedEvent"
    @delete-cal-timeslot="deleteTimeslot"
    @update-person="updateEventPerson"
    v-model="showDialog"
  >
  </EventDialog>
</template>

<style>
.vuecal--default-theme .vuecal__cell--selected::before {
  background-color: transparent;
}
</style>
