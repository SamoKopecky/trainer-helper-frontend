<script setup lang="ts">
import BlocksPanel from "@/components/BlocksPanel.vue"
import WeekDayCard from "@/components/WeekDayCard.vue"
import NotificationFloat from "@/components/NotificationFloat.vue"
import WeekDuplicateDialog from "@/components/WeekDupliateDialog.vue"
import { useNotifications } from "@/composables/useNotifications"
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
import { watch, ref } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  userId: {
    type: String,
    required: false,
    default: undefined,
  },
})

const weekDayService = new WeekDayService()
const exerciseService = new ExerciseService()
const timeslotService = new TimeslotService()

const { addNotification, notifications } = useNotifications()
const duplicateDialogActive = ref(false)
const activeWeekId = ref<number>()
const activeStartDate = ref<Date>()
const selectedUserId = ref<string>()
const router = useRouter()
const { users, userDisplay } = useUsers()
const weekDays = ref<Map<string, DisplayWeekDay>>(new Map())
const exercisesMap = ref<Map<number, ExerciseResponse[]>>(new Map())
const { isTrainer } = useUser()
const foundTimeslots = ref<Map<string, Timeslot>>(new Map())

watch(
  () => props.userId,
  () => {
    selectedUserId.value = undefined
    if (props.userId) {
      selectedUserId.value = props.userId
    }
  },
  { immediate: true },
)

function assignAll() {
  weekDays.value.forEach((wd) => {
    if (!wd.is_deleted) {
      assignWeekDay(wd)
    }
  })
}

function findTimeslots(startDate: Date) {
  if (!selectedUserId.value) return
  const endDate = new Date(startDate.valueOf())
  endDate.setDate(startDate.getDate() + 7)
  const newTimeslots: Map<string, Timeslot> = new Map()

  timeslotService
    .get({
      start_date: getISODateString(startDate),
      end_date: getISODateString(endDate),
      user_id: selectedUserId.value,
    })
    .then((res) => {
      res.forEach((timeslot) => {
        // NOTE:: Fix later, solve situation when there are multiple timeslots per day
        newTimeslots.set(getISODateString(timeslot.start), timeslot)
      })
      foundTimeslots.value = newTimeslots
    })
}

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
function updateStartDate(startDate: Date) {
  let dayIndex = 0
  const newWeekDays: Map<string, DisplayWeekDay> = new Map()
  weekDays.value.forEach((weekDay) => {
    unassignWeekDay(weekDay)
    const newDayDate = new Date(startDate.valueOf())
    newDayDate.setDate(startDate.getDate() + dayIndex)

    if (!weekDay.is_created) {
      weekDay.day_date = newDayDate
    } else {
      weekDayService
        .put({ id: weekDay.id, day_date: getISODateString(newDayDate) })
        .then(() => (weekDay.day_date = newDayDate))
    }

    dayIndex++
    newWeekDays.set(getISODateString(newDayDate), weekDay)
  })
  weekDays.value = newWeekDays
  findTimeslots(startDate)
}

function assignWeekDay(day: DisplayWeekDay) {
  const timeslot = foundTimeslots.value.get(getISODateString(day.day_date))
  if (!timeslot) return

  weekDayService
    .put({ id: day.id, timeslot_id: timeslot.id })
    .then(() => (day.timeslot_id = timeslot.id))
}

function unassignWeekDay(day: DisplayWeekDay) {
  weekDayService.deleteTimeslot(day.id).then(() => (day.timeslot_id = undefined))
}

function updateWeekId(weekId: number, startDate: Date) {
  activeWeekId.value = weekId
  activeStartDate.value = startDate
  weekDays.value = new Map()

  for (let i = 0; i < 7; i++) {
    // Create new date to avoid altering emited date
    const dayDate = new Date(startDate.valueOf())
    dayDate.setDate(startDate.getDate() + i)
    weekDays.value.set(getISODateString(dayDate), getEmptyWeekDay(dayDate, weekId))
  }

  findTimeslots(startDate)

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

function sucesfulDuplication() {
  addNotification("Duplication succesfull!", "success")
  if (!activeStartDate.value || !activeWeekId.value) return
  updateWeekId(activeWeekId.value, activeStartDate.value)
}
</script>

<template>
  <NotificationFloat :notifications="notifications" />
  <WeekDuplicateDialog
    v-model="duplicateDialogActive"
    :user-id="userId"
    :active-week-id="activeWeekId"
    @notfiy:reload="sucesfulDuplication"
  />

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

      <div v-if="userId">
        <BlocksPanel
          :user-id="userId"
          :is-editable="isTrainer"
          @update:week-id="updateWeekId"
          @update:start-date="updateStartDate"
        />
        <v-divider />

        <v-btn @click="assignAll">Assign all available</v-btn>
        <v-btn @click="duplicateDialogActive = true">Duplicate from other week</v-btn>
        <WeekDayCard
          v-for="day in weekDays.values()"
          :key="day.id"
          :day="day"
          :exercises="exercisesMap.get(day.id)!"
          @update:day="
            (newDayObject) => weekDays.set(getISODateString(newDayObject.day_date), newDayObject)
          "
          @update:exercises="(newExercises) => exercisesMap.set(day.id, newExercises!)"
          @add:week-day="addWeekDay"
          @assign:week-day="assignWeekDay"
          @unassing:week-day="unassignWeekDay"
        />
      </div>

      <div v-else>Choose a user above</div>
    </template>
  </v-card>
</template>
