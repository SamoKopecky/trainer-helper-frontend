<script setup lang="ts">
import { useRoute } from "vue-router"
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "@/components/NotificationFloat.vue"
import ExerciseTable from "@/components/ExerciseTable.vue"
import TimeslotControlPanel from "@/components/TimeslotControlPanel.vue"
import { useExercises } from "@/composables/useExercises"
import type { ExerciseTableColumn } from "@/types/exercise"
import { ExerciseService, type FullExerciseResponse } from "@/services/exercise"
import { ref } from "vue"
import { onMounted } from "vue"
import { timeslotToAppTimeslot } from "@/utils/tranformators"
import { ExerciseDuplicateService } from "@/services/exerciseDuplicate"
import { useUser } from "@/composables/useUser"
import { useExerciseTypes } from "@/composables/useExerciseTypes"
import { useExerciseTypeDialog } from "@/composables/useExerciseTypeDialog"
import ExerciseTypeDialog from "@/components/ExerciseTypeDialog.vue"

const EXERCISE_COLUMNS: ExerciseTableColumn[] = [
  { key: "group_id", type: "groups", name: "Group", is_multirow: true, align: "left" },
  {
    key: "exercise_type_id",
    type: "exercise_types",
    name: "Exercise Type",
    is_multirow: true,
    align: "left",
  },
  { key: "work_set_count", type: "number", name: "Set count", is_multirow: true, align: "center" },
  { key: "reps", type: "number", name: "Reps", is_multirow: false, align: "center" },
  { key: "intensity", type: "text", name: "Intensity", is_multirow: false, align: "center" },
  { key: "rpe", type: "number", name: "RPE", is_multirow: false, align: "center" },
  { key: "note", type: "textarea", name: "Note", is_multirow: true, align: "left" },
  { key: "delete", type: "button", name: "", is_multirow: true, align: "center" },
]

defineProps({
  id: String,
})

const route = useRoute()
const timeslotId = Number(route.params.id)
const exerciseService = new ExerciseService()
const exerciseDuplicateService = new ExerciseDuplicateService()
const exerciseRes = ref<FullExerciseResponse | undefined>()
const { isTrainer } = useUser()

onMounted(() => {
  exerciseService.get(timeslotId).then((res) => {
    exerciseRes.value = res
  })
})

const { notifications, addNotification } = useNotifications()
const { exercises, addExercise, deleteExercise, updateTable, updateTitle } = useExercises(
  timeslotId,
  exerciseRes,
  addNotification,
)
const { exerciseTypes } = useExerciseTypes()
const { showDialog, selectedType, handleCreate, handleUpdate, isNew, addNew } =
  useExerciseTypeDialog(exerciseTypes)

function duplicateTimeslot(duplicateFrom: number | undefined) {
  if (duplicateFrom) {
    exerciseDuplicateService
      .post({ copy_timeslot_id: duplicateFrom, timeslot_id: timeslotId })
      .then((res) => {
        exerciseRes.value = res
      })
  }
}

function displayExerciseType(exerciseTypeId: number) {
  selectedType.value = exerciseTypes.value.find((et) => et.id === exerciseTypeId)
  showDialog.value = true
}
</script>

<template>
  <NotificationFloat :notifications="notifications" />
  <TimeslotControlPanel
    :app-timeslot="exerciseRes ? timeslotToAppTimeslot(exerciseRes.timeslot) : undefined"
    :is-trainer="isTrainer"
    @add-exercise="addExercise"
    @update-title="updateTitle"
    @duplicate-timeslot="duplicateTimeslot"
    @create:exercise-type="addNew"
  >
    <ExerciseTable
      :columns="EXERCISE_COLUMNS"
      :exercises="exercises"
      :exercise-types="exerciseTypes"
      @update-table="updateTable"
      @delete-exercise="deleteExercise"
      @display:exercise-type="displayExerciseType"
    />
  </TimeslotControlPanel>

  <ExerciseTypeDialog
    v-model="showDialog"
    :exercise-type="selectedType"
    :is-new="isNew"
    @update:exercise-type="handleUpdate"
    @create:exercise-type="handleCreate"
  />
</template>
