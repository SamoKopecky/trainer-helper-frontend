<script setup lang="ts">
import type { CalTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { ref, watch, type PropType } from "vue"
import { EMPTY_USER } from "@/constants"

const { selectedEvent, modelValue } = defineProps({
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

watch(
  () => selectedEvent,
  () => {
    console.log("now")
    titleEditable.value = selectedEvent?.title === EMPTY_USER
  },
)

const titleEditable = ref(false)
const router = useRouter()
const emit = defineEmits(["delete-cal-timeslot", "update:modelValue"])

function redirectExercise(timeslot: CalTimeslot | null) {
  router.push({ path: `/exercise/${timeslot?.id}` })
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
      <v-card-title>
        <div style="display: flex; align-items: center; width: 100%">
          <!-- Static Title -->
          <span v-if="!titleEditable" style="flex: 1"> {{ selectedEvent?.title }}</span>

          <!-- Editable Title -->
          <v-autocomplete
            v-if="titleEditable"
            placeholder="Enter name"
            variant="plain"
            density="compact"
            hide-details="auto"
          />

          <!-- Edit Icon -->
          <v-icon small class="ml-2" @click="titleEditable = !titleEditable">
            {{ titleEditable ? "mdi-check" : "mdi-pencil" }}
          </v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <p style="padding-bottom: 1rem">{{ selectedEvent?.name }}</p>
        <v-btn
          style="margin-left: 0px"
          text="Go exericse"
          @click="redirectExercise(selectedEvent)"
        />
        <v-btn text="Delete timeslot" @click="deleteCalTimeslot(selectedEvent)" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  margin: 1rem 0px 0px 1rem;
}
</style>
