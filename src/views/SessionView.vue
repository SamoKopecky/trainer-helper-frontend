<script setup lang="ts">
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { ExerciseService, type ExerciseResponse } from "@/services/exercise"
import { WeekDayService } from "@/services/weekDay"
import type { WeekDay } from "@/types/block"
import { ref, watch } from "vue"
import { getISODateString } from "@/utils/date"

const weekDayService = new WeekDayService()
const exerciseService = new ExerciseService()
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const exercise = ref<ExerciseResponse[]>([])
const weekDay = ref<WeekDay>()

watch(
  () => props.id,
  () => {
    exerciseService.getMany([Number(props.id)]).then((res) => (exercise.value = res))
    weekDayService.get(Number(props.id)).then((res) => (weekDay.value = res))
  },
  { immediate: true },
)
</script>

<template>
  <v-card :title="weekDay?.name" :subtitle="getISODateString(new Date(weekDay!.day_date))">
    <v-divider></v-divider>
    <v-card-text>
      <ExercisesPanel :week-day-id="Number(id)" v-model="exercise" :show-to-session-btn="false" />
    </v-card-text>
  </v-card>
</template>
