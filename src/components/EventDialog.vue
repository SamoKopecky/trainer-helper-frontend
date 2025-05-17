<script setup lang="ts">
import type { CalTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { ref, watch, type PropType } from "vue"
import { useUsers } from "@/composables/useUsers"
import { time } from "console"

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
  isTrainer: {
    type: Boolean,
    required: true,
  },
})

watch(
  () => selectedEvent,
  () => {
    console.log(selectedEvent)
    selectedId.value = selectedEvent?.user?.id
  },
)

const selectedId = ref<string>()
const { users, userDisplay } = useUsers()
const router = useRouter()
const emit = defineEmits(["delete-cal-timeslot", "update:modelValue", "update-user"])

function redirectExercise(timeslot: CalTimeslot | null) {
  if (!timeslot) return

  const basePath = "/weekDay"
  if (timeslot.week_day) {
    router.push({ path: `${basePath}/${timeslot.week_day.id}` })
  } else {
    router.push({ path: basePath })
  }
}

function deleteCalTimeslot(event: CalTimeslot | null) {
  emit("delete-cal-timeslot", event)
}

function closeDialog() {
  emit("update:modelValue", false)
}

function buttonClick() {
  emit(
    "update-user",
    users.value?.find((p) => p.id === selectedId.value),
  )
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog">
    <v-card>
      <v-card-title>
        <v-autocomplete
          v-model="selectedId"
          :items="users"
          :item-title="userDisplay"
          item-value="id"
          placeholder="Asign athlete..."
          variant="plain"
          density="compact"
          hide-details="auto"
          @update:model-value="buttonClick"
        />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p v-if="selectedEvent?.week_day?.name" class="pd-1">{{ selectedEvent?.week_day?.name }}</p>
        <v-btn
          style="margin-left: 0px"
          text="Go to exercises"
          @click="redirectExercise(selectedEvent)"
        />
        <v-btn v-if="isTrainer" text="Delete timeslot" @click="deleteCalTimeslot(selectedEvent)" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  margin: 1rem 0px 0px 1rem;
}
</style>
