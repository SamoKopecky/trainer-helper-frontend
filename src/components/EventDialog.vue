<script setup lang="ts">
import type { CalTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { type PropType } from "vue"

defineProps({
  selectedEvent: {
    type: Object as PropType<CalTimeslot | null>,
    required: false,
    default: null,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const router = useRouter()
const emit = defineEmits(["delete-cal-timeslot", "update:modelValue"])

function redirectExercise(event: CalTimeslot | null) {
  router.push({ path: `/exercise/${event?.timeslot_id}` })
}

function deleteCalTimeslot(event: CalTimeslot | null) {
  emit("delete-cal-timeslot", event)
}

function closeDialog() {
  emit("update:modelValue", false)
}
</script>

<template>
  <v-dialog max-width="500" :model-value="modelValue" @update:model-value="closeDialog">
    <v-card>
      <v-card-text>
        <p>Event titled {{ selectedEvent?.title }}</p>
        <v-btn text="Go exericse" @click="redirectExercise(selectedEvent)" />
        <v-btn text="Delete timeslot" @click="deleteCalTimeslot(selectedEvent)" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style></style>
