<script setup lang="ts">
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { ExerciseService, type ExerciseResponse } from "@/services/exercise"
import { WeekDayService } from "@/services/weekDay"
import type { WeekDay } from "@/types/block"
import { ref, watch } from "vue"
import { formatDate } from "@/utils/date"

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
// TODO: solve issue if exercise table is empty
// TODO: solve calendar assing issues
</script>

<template>
  <div class="mr-2 ml-2">
    <div style="text-align: center">
      <h2>{{ weekDay?.name }}</h2>
      <h4>{{ formatDate(new Date(weekDay!.day_date)) }}</h4>
    </div>
    <v-divider></v-divider>
    <ExercisesPanel :week-day-id="Number(id)" v-model="exercise" :show-to-session-btn="false" />
  </div>
</template>
