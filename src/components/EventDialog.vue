<script setup lang="ts">
import type { CalTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { ref, watch, type PropType } from "vue"
import { useUsers } from "@/composables/useUsers"
import { WeekDayService } from "@/services/weekDay"
import { getISODateString } from "@/utils/date"
import { type WeekDay } from "@/types/block"

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
    dayDateMatch.value = undefined
    if (!selectedEvent) return
    selectedUserId.value = selectedEvent.user?.id
    if (!selectedUserId.value) return
    weekDayService
      .get({
        user_id: selectedUserId.value,
        day_date: getISODateString(selectedEvent.start),
      })
      .then((res) => {
        if (res.length == 0) return
        dayDateMatch.value = res[0]
      })
  },
)

const weekDayService = new WeekDayService()
const selectedUserId = ref<string>()
const { users, userDisplay } = useUsers()
const router = useRouter()
const emit = defineEmits(["delete-cal-timeslot", "update:modelValue", "update-user"])
const dayDateMatch = ref<WeekDay>()

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

function updateUser() {
  emit(
    "update-user",
    users.value?.find((p) => p.id === selectedUserId.value),
  )
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog">
    <v-card>
      <v-card-title>
        <v-autocomplete
          v-model="selectedUserId"
          :items="users"
          :item-title="userDisplay"
          item-value="id"
          placeholder="Asign athlete..."
          variant="plain"
          density="compact"
          hide-details="auto"
          @update:model-value="updateUser"
        />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p v-if="selectedEvent?.week_day?.name" class="pd-1">{{ selectedEvent?.week_day?.name }}</p>
        <v-btn class="mr-2" text="Go to exercises" @click="redirectExercise(selectedEvent)" />
        <v-btn v-if="isTrainer" text="Delete timeslot" @click="deleteCalTimeslot(selectedEvent)" />
        <v-spacer />
        <v-btn text="Assign" :disabled="!dayDateMatch" class="mt-3" />
        <div v-if="dayDateMatch" class="mt-2">
          <v-icon color="green">mdi-check-circle</v-icon>
          <span class="text-green text-caption">
            Week day found! {{ dayDateMatch.name }} at
            {{ dayDateMatch.day_date.toLocaleDateString() }}
          </span>
        </div>
        <div v-else-if="!dayDateMatch" class="mt-2">
          <span class="text-caption text-grey">
            Week day not found, go to athelte overview and create a new week day
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
