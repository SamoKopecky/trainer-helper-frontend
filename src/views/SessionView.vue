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
// TODO: add week name
// TODO: Fix content change when timeslot is assinged
// TODO: create exercise types on user creation

watch(
  () => props.id,
  () => {
    exerciseService.getMany([Number(props.id)]).then((res) => (exercise.value = res))
  },
  { immediate: true },
)
</script>

<template>
  <div class="mr-2 ml-2">
    <h1></h1>
    <ExercisesPanel :week-day-id="Number(id)" v-model="exercise" />
  </div>
</template>
