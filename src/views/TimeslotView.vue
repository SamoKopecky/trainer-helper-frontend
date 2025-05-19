<script setup lang="ts">
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { ExerciseService, type ExerciseResponse } from "@/services/exercise"
import { ref, watch } from "vue"

const exerciseService = new ExerciseService()
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const exercise = ref<ExerciseResponse[]>([])

watch(
  () => props.id,
  () => {
    exerciseService.getMany([Number(props.id)]).then((res) => (exercise.value = res))
  },
  { immediate: true },
)
</script>

<template>
  <ExercisesPanel :week-day-id="Number(id)" v-model="exercise" />
</template>
