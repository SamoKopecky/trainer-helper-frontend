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

const copyWithAiActive = ref(false)
const copyWithAiLoading = ref(false)
const rawTextField = ref<string>()
const exercisesModel = defineModel<ExerciseResponse[]>()
const props = defineProps({
  weekDayId: {
    type: Number,
    required: true,
  },
  showToSessionBtn: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const { isTrainer } = useUser()
const isTableEditable = ref(false)

const { notifications, addNotification } = useNotifications()
const { addChangeEvent, redo, undo, redoActive, undoActive } = useChangeEvents(addNotification)
const {
  exercises,
  addExercise,
  deleteExercise,
  updateTable,
  copyWorkSet,
  goToSession,
  copyWithAi,
} = useExercises(props.weekDayId, exercisesModel, addNotification, addChangeEvent)
const { exerciseTypes } = useExerciseTypes()
const { showDialog, selectedType, handleCreate, handleUpdate, isNew, addNew } =
  useExerciseTypeDialog(exerciseTypes)

function displayExerciseType(exerciseTypeId: number) {
  selectedType.value = exerciseTypes.value.find((et) => et.id === exerciseTypeId)
  showDialog.value = true
}

function copyWithAiConfirm() {
  if (!rawTextField.value) {
    addNotification("empty table, please fill in the text area", "info")
    return
  }
  copyWithAiLoading.value = true
  copyWithAi(rawTextField.value)
    .then()
    .finally(() => {
      copyWithAiLoading.value = false
      copyWithAiActive.value = false
    })
}
</script>

<template>
  <div>
    <NotificationFloat :notifications="notifications" />
    <v-dialog v-model="copyWithAiActive">
      <v-card title="Copy from google document" max-width="500px">
        <template #text>
          <p>
            Copy the whole table <b>including</b> the column header name and paste it bellow.
            <br />
            <b>WARNING: This will delete all old exericses</b>
          </p>
          <v-textarea
            class="mt-2"
            v-model="rawTextField"
            variant="outlined"
            hide-details="auto"
            placeholder="Paste table here ..."
            label="Coppied table"
            :auto-grow="false"
          />
          <v-btn
            class="mt-2"
            color="green"
            @click="copyWithAiConfirm"
            :loading="copyWithAiLoading"
            text="Confirm"
          />
        </template>
      </v-card>
    </v-dialog>
    <ExerciseTypeDialog
      v-model="showDialog"
      :exercise-type="selectedType"
      :is-new="isNew"
      @update:exercise-type="handleUpdate"
      @create:exercise-type="handleCreate"
    />

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
          variant="text"
          icon="mdi-table-edit"
        />
        <v-btn
          v-else-if="isTableEditable"
          color="green"
          v-tooltip:bottom="'Save table'"
          @click="isTableEditable = false"
          variant="text"
          icon="mdi-check"
        />
        <v-btn
          v-if="showToSessionBtn"
          v-tooltip:bottom="'To session'"
          @click="goToSession(weekDayId)"
          variant="text"
          icon="mdi-table-arrow-down"
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
    <div class="mt-2">
      <v-btn class="ml-2" text="Add exercise" @click="addExercise" />
      <v-btn class="ml-2" v-if="isTrainer" text="Add exercise type" @click="addNew" />
      <v-btn
        class="ml-2"
        v-if="isTrainer"
        color="blue"
        text="Copy from google docs "
        @click="copyWithAiActive = true"
      />
    </div>
  </div>
</template>

<style scoped></style>
