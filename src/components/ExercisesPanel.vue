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

defineProps({
  id: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const weekDayId = Number(route.params.id)
const exerciseService = new ExerciseService()
const exerciseRes = ref<FullExerciseResponse | undefined>()
const { isTrainer } = useUser()
const isTableEditable = ref(false)

onMounted(() => {
  exerciseService.get(weekDayId).then((res) => {
    exerciseRes.value = res
  })
})

const { notifications, addNotification } = useNotifications()
const { addChangeEvent, redo, undo, redoActive, undoActive } = useChangeEvents(addNotification)
const { exercises, addExercise, deleteExercise, updateTable, updateTitle, copyWorkSet } =
  useExercises(weekDayId, exerciseRes, addNotification, addChangeEvent)
const { exerciseTypes } = useExerciseTypes()
const { showDialog, selectedType, handleCreate, handleUpdate, isNew, addNew } =
  useExerciseTypeDialog(exerciseTypes)

function duplicateTimeslot(duplicateFrom: number | undefined) {
  if (duplicateFrom) {
    exerciseService
      .postDuplicate({ copy_timeslot_id: duplicateFrom, timeslot_id: weekDayId })
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
      :is-table-editable="isTableEditable"
      @update-table="updateTable"
      @delete-exercise="deleteExercise"
      @display:exercise-type="displayExerciseType"
      @update:copy-work-set="copyWorkSet"
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
