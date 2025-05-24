<script setup lang="ts">
import "vue-cal/style"
import { VueCal } from "vue-cal"
import { useChangeEvents } from "@/composables/useChangeEvents"
import EventDialog from "@/components/EventDialog.vue"
import { useCalendar } from "@/composables/useCalendar"
import { useUser } from "@/composables/useUser"
import { useTheme } from "vuetify"
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "@/components/NotificationFloat.vue"
import ChangeEventBar from "@/components/ChangeEventBar.vue"
import { ref } from "vue"
import type { CalTimeslot } from "@/types/calendar"

const { notifications, addNotification } = useNotifications()
const { addChangeEvent, undo, redo, undoActive } = useChangeEvents(addNotification)
const showDialog = ref(false)
const selectedEvent = ref<CalTimeslot>()
const {
  events,
  vueCalRef,
  createTimeslot,
  deleteTimeslot,
  clickTimeslot,
  updateEventUser,
  eventMove,
} = useCalendar(selectedEvent, showDialog, addChangeEvent)
const { isTrainer } = useUser()
const theme = useTheme()
</script>

<template>
  <NotificationFloat :notifications="notifications" />
  <!-- TODO: Adjust change events for calendar -->
  <ChangeEventBar :is-undo-active="undoActive" :is-redo-active="false" @undo="undo" @redo="redo" />
  <VueCal
    :dark="theme.global.current.value.dark"
    style="height: 100%"
    ref="vueCalRef"
    events-on-month-view
    :editable-events="{
      create: isTrainer,
      resize: false,
      drag: isTrainer,
      delete: isTrainer,
    }"
    :events="events"
    :snap-to-interval="5"
    :views="['day', 'week', 'month']"
    :time-from="8 * 60"
    :time-to="22 * 60"
    :time-step="30"
    @event-click="clickTimeslot"
    @event-create="createTimeslot"
    @event-drop="eventMove"
  ></VueCal>

  <EventDialog
    @delete-cal-timeslot="deleteTimeslot"
    @update-user="updateEventUser"
    v-model:active="showDialog"
    v-model:timeslot="selectedEvent"
  />
</template>

<style>
.vuecal {
  .vuecal__scrollable--month-view {
    .vuecal__cell {
      display: flex;
      min-height: 4rem;
    }
    .vuecal__event {
      height: 15px;
      margin-top: 1px;
    }
    .vuecal__event-details {
      font-size: 12px;
      white-space: nowrap;
      padding: 0;
    }
    .vuecal__cell--has-events {
      flex-direction: row-reverse;
      overflow: hidden;
      justify-content: flex-start;
    }
  }
  .vuecal__event {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .vuecal__event-title {
    font-weight: bold;
  }
  .vuecal__event-content {
    margin-top: 0.5rem;
  }
}

.vuecal--default-theme .vuecal__cell--selected::before {
  background-color: transparent;
}
.vuecal__event.no-user {
  background-color: #79797a;
}
</style>
