<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { WeekDayService } from "@/services/weekDay"
import type { DisplayWeekDay } from "@/types/block"
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { useDebounceFn } from "@vueuse/core"
import { getISODateString } from "@/utils/date"
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
          :disabled="!isTrainer || !day.is_created || day.is_deleted"
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
          v-tooltip:bottom="'Recover deleted exercise table'"
        />
        <div v-if="timeslot">
          Timeslot exists, create exercise to assign week day to timeslot
          {{ timeslot.start }}
        </div>
      </div>

      <div v-else-if="day.is_created">
        <ExercisesPanel :week-day-id="day.id" v-model="exercises" />
        <v-spacer />
        <div v-if="day.timeslot_id && timeslot">
          Has timeslot: {{ timeslot.start }}
          <v-btn @click="emit('unassing:week-day', day)">Unassign</v-btn>
        </div>
        <div v-else-if="timeslot">
          timeslot found at {{ timeslot.start }}

          <v-btn @click="emit('add:week-day', day)">Assign</v-btn>
        </div>
      </div>

      <div v-else-if="isTrainer">
        <v-btn
          @click="emit('add:week-day', day)"
          icon="mdi-plus"
          v-tooltip:bottom="'Add new exercise table'"
        />
        <div v-if="timeslot">
          Timeslot exists, create exercise to assign week day to timeslot
          {{ timeslot.start }}
        </div>
      </div>
    </template>
    <v-divider />
  </v-card>
</template>
