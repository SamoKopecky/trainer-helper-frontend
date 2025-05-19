<script setup lang="ts">
import ExercisesPanel from "@/components/ExercisesPanel.vue"
import { ExerciseService, type ExerciseResponse } from "@/services/exercise"
import { ref, watch } from "vue"

const exerciseService = new ExerciseService()
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
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
  <ExercisesPanel v-if="props.id" :week-day-id="Number(id)" v-model="exercise" />
  <div v-else>Assign a weekDay</div>
</template>
