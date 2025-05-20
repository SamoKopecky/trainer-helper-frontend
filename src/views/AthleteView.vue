<script setup lang="ts">
import BlocksPanel from "@/components/BlocksPanel.vue"
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { useUser } from "@/composables/useUser"
import { useUsers } from "@/composables/useUsers"
import { ExerciseService, type ExerciseResponse } from "@/services/exercise"
import { TimeslotService } from "@/services/timeslots"
import { WeekDayService } from "@/services/weekDay"
import type { DisplayWeekDay } from "@/types/block"
import type { Timeslot } from "@/types/other"
import { getDateWeekDayString, getISODateString } from "@/utils/date"
import { randomNumberId } from "@/utils/other"
import { exerciseResponsesToMap, weekDayToDisplayWeekDay } from "@/utils/tranformators"
import { useDebounceFn } from "@vueuse/core"
import { watch, ref } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
})

const weekDayService = new WeekDayService()
const exerciseService = new ExerciseService()
const timeslotService = new TimeslotService()

const selectedUserId = ref<string>()
const router = useRouter()
const { users, userDisplay } = useUsers()
const weekDays = ref<Map<string, DisplayWeekDay>>(new Map())
const exercisesMap = ref<Map<number, ExerciseResponse[]>>(new Map())
const { isTrainer } = useUser()
const foundTimeslots = ref<Map<number, Timeslot>>(new Map())

watch(
  () => props.id,
  () => {
    selectedUserId.value = undefined
    if (props.id) {
      selectedUserId.value = props.id
    }
  },
  { immediate: true },
)

function getEmptyWeekDay(dayDate: Date, weekId: number): DisplayWeekDay {
  return {
    day_date: dayDate,
    is_deleted: false,
    name: "",
    id: randomNumberId(),
    is_created: false,
    day_string: getDateWeekDayString(dayDate),
    week_id: weekId,
  }
}

// Update when start of week changes
function updateActiveWeekIdWithNewDate(startDate: Date) {
  let index = 0
  weekDays.value.forEach((week) => {
    // NOTE: possible preformance improvment, update many
    if (!week.is_created) {
      index++
      return
    }
    const newDayDate = new Date(startDate.valueOf())
    newDayDate.setDate(startDate.getDate() + index)
    weekDayService.put({ id: week.id, day_date: getISODateString(newDayDate) }).then(() => {
      week.day_date = startDate
    })
    index++
  })
}

function updateActiveWeekId(weekId: number, startDate: Date) {
  weekDays.value = new Map()
  for (let i = 0; i < 7; i++) {
    // Create new date to avoid altering emited date
    const dayDate = new Date(startDate.valueOf())
    dayDate.setDate(startDate.getDate() + i)
    weekDays.value.set(getISODateString(dayDate), getEmptyWeekDay(dayDate, weekId))
  }

  const weekDayIds: number[] = []
  weekDayService
    .get({ week_id: weekId })
    .then((res) =>
      res.forEach((weekDay) => {
        weekDayIds.push(weekDay.id)
        weekDays.value.set(getISODateString(weekDay.day_date), weekDayToDisplayWeekDay(weekDay))
      }),
    )
    .finally(() =>
      exerciseService
        .getMany(weekDayIds)
        .then((res) => (exercisesMap.value = exerciseResponsesToMap(res))),
    )
}

function addWeekDay(week: DisplayWeekDay) {
  weekDayService
    .post({
      // Is always not undefined
      user_id: selectedUserId.value!,
      week_id: week.week_id,
      day_date: getISODateString(week.day_date),
    })
    .then((newWeekDay) => {
      weekDays.value.set(getISODateString(newWeekDay.day_date), weekDayToDisplayWeekDay(newWeekDay))
    })
}

function redirectToAthlete() {
  router.push({ path: `/athlete/${selectedUserId.value}` })
}

const updateNameDebounce = useDebounceFn((newDay: DisplayWeekDay) => {
  weekDayService.put({
    name: newDay.name,
    id: newDay.id,
  })
}, 1000)

function deleteWeekDay(day: DisplayWeekDay) {
  weekDayService.delete(day.id).then(() => {
    const deletedWeekDay = weekDays.value.get(getISODateString(day.day_date))
    if (deletedWeekDay) deletedWeekDay.is_deleted = true
  })
}

function restoreDeletedExerciseTable(day: DisplayWeekDay) {
  weekDayService.postUndelete(day.id).then(() => {
    const deletedWeekDay = weekDays.value.get(getISODateString(day.day_date))
    if (deletedWeekDay) deletedWeekDay.is_deleted = false
  })
}
</script>

<template>
  <v-card :title="'User name/nickname'" flat>
    <template #title>
      <v-autocomplete
        v-model="selectedUserId"
        @update:model-value="redirectToAthlete"
        :items="users"
        :item-title="userDisplay"
        item-value="id"
        placeholder="Enter name"
        variant="plain"
        density="compact"
        hide-details="auto"
      >
        <template #selection="{ item }">
          <span class="text-h6 font-weight-medium pd-4">
            {{ userDisplay(item.raw) }}
          </span>
        </template>
      </v-autocomplete>
    </template>

    <template #text>
      <v-divider />

      <div v-if="id">
        <BlocksPanel
          :user-id="id"
          @update:active-week-id="updateActiveWeekId"
          @update:active-week-days="updateActiveWeekIdWithNewDate"
        />
        <v-divider />

        <v-card v-for="day in weekDays.values()" :key="day.id">
          <template #title>
            <div class="mt-2 d-flex align-center">
              <v-text-field
                label="Name"
                :disabled="!isTrainer"
                variant="outlined"
                hide-details="auto"
                v-model="day.name"
                placeholder="Choose a name..."
                @update:model-value="updateNameDebounce(day)"
              />
              <v-btn
                v-if="isTrainer"
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
            </div>

            <div v-else-if="day.is_created">
              <ExercisesPanel
                :week-day-id="day.id"
                :model-value="exercisesMap.get(day.id)"
                @update:model-value="(newValue) => exercisesMap.set(day.id, newValue!)"
              />
              <v-spacer></v-spacer>
            </div>

            <div v-else-if="isTrainer">
              <v-btn
                @click="addWeekDay(day)"
                icon="mdi-plus"
                v-tooltip:bottom="'Add new exercise table'"
              />
            </div>
            {{ foundTimeslots.get(day.id)?.start }}
          </template>
          <v-divider />
        </v-card>
      </div>

      <div v-else>Choose a user above</div>
    </template>
  </v-card>
</template>
