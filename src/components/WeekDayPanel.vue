<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { WeekDayService } from "@/services/weekDay"
import type { DisplayWeekDay } from "@/types/block"
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { useDebounceFn } from "@vueuse/core"
import { formatTime, getISODateString } from "@/utils/date"
import type { PropType } from "vue"
import type { Timeslot } from "@/types/other"
import { type ExerciseResponse } from "@/services/exercise"

const weekDayService = new WeekDayService()

const day = defineModel<DisplayWeekDay>("day", { required: true })
const exercises = defineModel<ExerciseResponse[]>("exercises")

const { isTrainer } = useUser()
const emit = defineEmits(["add:week-day", "assign:week-day", "unassing:week-day"])
defineProps({
  timeslot: {
    type: Object as PropType<Timeslot>,
    required: false,
    default: undefined,
  },
})

const updateNameDebounce = useDebounceFn((newDay: DisplayWeekDay) => {
  weekDayService.put({
    name: newDay.name,
    id: newDay.id,
  })
}, 1000)

function deleteWeekDay(day: DisplayWeekDay) {
  weekDayService.delete(day.id).then(() => (day.is_deleted = true))
}

function restoreDeletedExerciseTable(day: DisplayWeekDay) {
  weekDayService.postUndelete(day.id).then(() => (day.is_deleted = false))
}
</script>

<template>
  <v-card>
    <template #title>
      <div class="mt-2 d-flex align-center">
        <v-text-field
          label="Name"
          :disabled="!day.is_created || day.is_deleted"
          :readonly="!isTrainer"
          variant="outlined"
          hide-details="auto"
          v-model="day.name"
          placeholder="Choose a name..."
          @update:model-value="updateNameDebounce(day)"
        />
        <v-btn
          v-if="isTrainer && day.is_created && !day.is_deleted"
          class="ml-2"
          icon="mdi-close"
          variant="text"
          v-tooltip:bottom="'Delete'"
          color="error"
          @click="deleteWeekDay(day)"
        />
      </div>
    </template>

    <template #subtitle>
      {{ `${day.day_string} | ${getISODateString(day.day_date)}` }}
    </template>

    <template #text>
      <div v-if="day.is_deleted && isTrainer">
        <v-btn
          @click="restoreDeletedExerciseTable(day)"
          icon="mdi-plus"
          v-tooltip:bottom="'Recover deleted session'"
        />
        <div v-if="timeslot" class="mt-2 text-caption text-grey">
          Timeslot exists at {{ formatTime(timeslot.start) }} &ndash;
          {{ formatTime(timeslot.end) }} but there is no session to asign it to, create a session
          first
        </div>
      </div>

      <div v-else-if="day.is_created">
        <ExercisesPanel :week-day-id="day.id" v-model="exercises" />
        <v-spacer />
        <div v-if="isTrainer" class="mt-2">
          <div v-if="day.timeslot_id && timeslot">
            <div class="mt-2 d-flex align-center">
              Session assinged at {{ formatTime(timeslot.start) }} &ndash;
              {{ formatTime(timeslot.end) }}
              <v-btn
                icon="mdi-close-circle"
                variant="text"
                density="compact"
                v-tooltip:bottom="'Unassing'"
                color="error"
                @click="emit('unassing:week-day', day)"
                class="ml-1"
              />
            </div>
          </div>

          <!-- Assign found timeslot -->
          <div v-else-if="timeslot">
            <v-btn text="Assign" color="green" @click="emit('assign:week-day', day)" />

            <div class="mt-2 text-green d-flex align-center">
              <v-icon color="green" class="mr-1">mdi-check-circle</v-icon>
              <span
                >Session found at {{ formatTime(timeslot.start) }} &ndash;
                {{ formatTime(timeslot.end) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="isTrainer">
        <v-btn
          @click="emit('add:week-day', day)"
          icon="mdi-plus"
          v-tooltip:bottom="'Add new session'"
        />
        <div v-if="timeslot" class="mt-2 text-caption text-grey">
          Timeslot exists at {{ formatTime(timeslot.start) }} &ndash;
          {{ formatTime(timeslot.end) }} but there is no session to asign it to, create a session
          first
        </div>
      </div>
    </template>
    <v-divider />
  </v-card>
</template>
