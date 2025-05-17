<script setup lang="ts">
import BlocksPanel from "@/components/BlocksPanel.vue"
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { useUsers } from "@/composables/useUsers"
import { ExerciseService, type ExerciseResponse } from "@/services/exercise"
import { WeekDayService } from "@/services/weekDay"
import type { DisplayWeekDay } from "@/types/block"
import { getDateWeekDayString, getISODateString } from "@/utils/date"
import { randomNumberId } from "@/utils/other"
import { exerciseResponsesToMap, weekDayToDisplayWeekDay } from "@/utils/tranformators"
import { watch } from "vue"
import { ref } from "vue"
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

const selectedUserId = ref<string>()
const panels = ref([])
const router = useRouter()
const { users, userDisplay } = useUsers()
const weekDays = ref<Map<string, DisplayWeekDay>>(new Map())
const exercisesMap = ref<Map<number, ExerciseResponse[]>>(new Map())

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

function updateActiveWeekId(weekId: number, startDate: Date) {
  weekDays.value = new Map()
  for (let i = 0; i < 7; i++) {
    // Create new date to avoid altering emited date
    const dayDate = new Date(startDate.valueOf())
    dayDate.setDate(startDate.getDate() + i)
    weekDays.value.set(getISODateString(dayDate), {
      day_date: dayDate,
      name: "-",
      id: randomNumberId(),
      is_created: false,
      day_string: getDateWeekDayString(dayDate),
      week_id: weekId,
    })
  }

  const weekDayIds: number[] = []
  weekDayService
    .get(weekId)
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
    .then((newWeekDay) =>
      weekDays.value.set(
        getISODateString(newWeekDay.day_date),
        weekDayToDisplayWeekDay(newWeekDay),
      ),
    )
}

function redirectToAthlete() {
  router.push({ path: `/athlete/${selectedUserId.value}` })
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
          </span></template
        >
      </v-autocomplete>
    </template>
    <template #text>
      <v-divider />
      <div v-if="id">
        <BlocksPanel :user-id="id" @update:active-week-id="updateActiveWeekId" />
        <v-divider />
        <v-expansion-panels variant="accordion" multiple v-model="panels">
          <v-expansion-panel v-for="day in weekDays.values()" :key="day.id" :title="day.day_string">
            <!-- Panel has table -->
            <v-expansion-panel-text v-if="day.is_created">
              <ExercisesPanel
                :week-day-id="day.id"
                :model-value="exercisesMap.get(day.id)"
                @update:model-value="(newValue) => exercisesMap.set(day.id, newValue!)"
              >
              </ExercisesPanel>
            </v-expansion-panel-text>
            <!-- Panel doesn't have table -->
            <v-expansion-panel-text v-else>
              <v-btn @click="addWeekDay(day)">Add exercise table</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <div v-else>Choose a user above</div>
    </template>
  </v-card>
</template>
