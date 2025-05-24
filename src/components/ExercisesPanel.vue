<script setup lang="ts">
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "@/components/NotificationFloat.vue"
import ExerciseTable from "@/components/ExerciseTable.vue"
import { useExercises } from "@/composables/useExercises"
import type { ExerciseTableColumn } from "@/types/exercise"
import { type ExerciseResponse } from "@/services/exercise"
import { ref } from "vue"
import { useUser } from "@/composables/useUser"
import { useExerciseTypes } from "@/composables/useExerciseTypes"
import { useExerciseTypeDialog } from "@/composables/useExerciseTypeDialog"
import ExerciseTypeDialog from "@/components/ExerciseTypeDialog.vue"
import { useChangeEvents } from "@/composables/useChangeEvents"
import ChangeEventBar from "@/components/ChangeEventBar.vue"

const EXERCISE_COLUMNS: ExerciseTableColumn[] = [
  { key: "group_id", type: "special", name: "Group", isMultirow: true, align: "left" },
  {
    key: "exercise_type_id",
    type: "special",
    name: "Exercise Type",
    isMultirow: true,
    align: "left",
  },
  { key: "work_set_count", type: "number", name: "Set count", isMultirow: true, align: "center" },
  { key: "reps", type: "number", name: "Reps", isMultirow: false, align: "center" },
  { key: "intensity", type: "text", name: "Intensity", isMultirow: false, align: "center" },
  { key: "rpe", type: "number", name: "RPE", isMultirow: false, align: "center" },
  { key: "note", type: "special", name: "Note", isMultirow: true, align: "left" },
  { key: "delete", type: "special", name: "", isMultirow: true, align: "center" },
]

const exercisesModel = defineModel<ExerciseResponse[]>()
const props = defineProps({
  weekDayId: {
    type: Number,
    required: true,
  },
})

const { isTrainer } = useUser()
const isTableEditable = ref(false)

const { notifications, addNotification } = useNotifications()
const { addChangeEvent, redo, undo, redoActive, undoActive } = useChangeEvents(addNotification)
const { exercises, addExercise, deleteExercise, updateTable, copyWorkSet } = useExercises(
  props.weekDayId,
  exercisesModel,
  addNotification,
  addChangeEvent,
)
const { exerciseTypes } = useExerciseTypes()
const { showDialog, selectedType, handleCreate, handleUpdate, isNew, addNew } =
  useExerciseTypeDialog(exerciseTypes)

function displayExerciseType(exerciseTypeId: number) {
  selectedType.value = exerciseTypes.value.find((et) => et.id === exerciseTypeId)
  showDialog.value = true
}
</script>

<template>
  <NotificationFloat :notifications="notifications" />
  <ChangeEventBar
    :is-undo-active="undoActive"
    :is-redo-active="redoActive"
    @undo="undo"
    @redo="redo"
  >
    <template #extra>
      <v-btn
        v-if="!isTableEditable"
        v-tooltip:bottom="'Edit table'"
        @click="isTableEditable = true"
        icon="mdi-table-edit"
      />
      <v-btn
        v-else-if="isTableEditable"
        color="green"
        v-tooltip:bottom="'Save table'"
        @click="isTableEditable = false"
        icon="mdi-check"
      />
    </template>
  </ChangeEventBar>

  <ExerciseTable
    :columns="EXERCISE_COLUMNS"
    :exercises="exercises"
    :exercise-types="exerciseTypes"
    :is-table-editable="isTableEditable"
    @update-table="updateTable"
    @delete-exercise="deleteExercise"
    @display:exercise-type="displayExerciseType"
    @update:copy-work-set="copyWorkSet"
  />
  <v-btn class="mt-2 mr-2" text="Add exercise" @click="addExercise" />
  <v-btn class="mt-2" v-if="isTrainer" text="Add exercise type" @click="addNew" />

  <ExerciseTypeDialog
    v-model="showDialog"
    :exercise-type="selectedType"
    :is-new="isNew"
    @update:exercise-type="handleUpdate"
    @create:exercise-type="handleCreate"
  />
</template>
