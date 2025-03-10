<script setup lang="ts">
import { useRoute } from "vue-router"
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "@/components/NotificationFloat.vue"
import ExerciseTable from "@/components/ExerciseTable.vue"
import TimeslotControlPanel from "@/components/TimeslotControlPanel.vue"
import { useExercises } from "@/composables/useExercises"
import type { ExerciseTableColumn } from "@/types/exercises"
import { ExerciseService, type FullExerciseResponse } from "@/services/exercise"
import { ref } from "vue"
import { onMounted } from "vue"

const EXERCISE_COLUMNS: ExerciseTableColumn[] = [
  { key: "delete", type: "button", name: "", is_multirow: true },
  { key: "group_id", type: "select", name: "Group", is_multirow: true },
  { key: "set_type", type: "select", name: "Set Type", is_multirow: true },
  { key: "work_set_count", type: "number", name: "Set count", is_multirow: true },
  { key: "reps", type: "number", name: "Repetitions", is_multirow: false },
  { key: "intensity", type: "text", name: "Intensity", is_multirow: false },
  { key: "rpe", type: "number", name: "RPE", is_multirow: false },
  { key: "note", type: "textarea", name: "Note", is_multirow: true },
]

defineProps({
  id: String,
})

const route = useRoute()
const timeslotId = Number(route.params.id)
const exerciseService = new ExerciseService()
const exercisesRes = ref<FullExerciseResponse | undefined>()

onMounted(() => {
  exerciseService.get(timeslotId).then((res) => {
    exercisesRes.value = res
  })
})

const { notifications, addNotification } = useNotifications()
const { exercises, addExercise, deleteExercise, updateTable } = useExercises(
  timeslotId,
  exercisesRes,
  addNotification,
)
</script>

<template>
  <NotificationFloat :notifications="notifications" />
  <TimeslotControlPanel :timeslot-info="exercisesRes" @add-exercise="addExercise">
    <ExerciseTable
      :columns="EXERCISE_COLUMNS"
      :exercises="exercises"
      @update-table="updateTable"
      @delete-exercise="deleteExercise"
    />
  </TimeslotControlPanel>
</template>
