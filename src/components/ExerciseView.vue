<script setup lang="ts">
import {
  deepClone,
  exerciseToTableData,
  increaseWorkSets,
  decreaseWorkSets,
} from "@/utils/exerciseView"
import { ref } from "vue"
import { useRoute } from "vue-router"
import {
  ExerciseUpdateType,
  type ExerciseTableData,
  type ExerciseTableColumn,
  type Diff,
  type WorkSetCountDiff,
} from "@/types"
import { watchDebounced } from "@vueuse/core"
import { ExerciseConnector, type ExerciseResponse } from "@/backendHelpers/exercise"
import { WorkSetConnector } from "@/backendHelpers/worksets"
import { ExerciseCountConnector } from "@/backendHelpers/exerciseCount"
import { isExerciseDiff, isWorkSetCountDiff, isWorkSetDiff, tableDataDiff } from "@/utils/diff"
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "./NotificationFloat.vue"
import ExerciseTable from "./ExerciseTable.vue"

const EXERCISE_COLUMNS: ExerciseTableColumn[] = [
  { key: "delete", type: "button", name: "", is_multirow: true },
  { key: "group_id", type: null, name: "Group", is_multirow: true },
  { key: "set_type", type: "select", name: "Set Type", is_multirow: true },
  { key: "work_set_count", type: "number", name: "Set count", is_multirow: true },
  { key: "reps", type: "number", name: "Repetitions", is_multirow: false },
  { key: "intensity", type: "text", name: "Intensity", is_multirow: false },
  { key: "rpe", type: "number", name: "RPE", is_multirow: false },
  { key: "note", type: "text", name: "Note", is_multirow: true },
]

defineProps({
  id: String,
})

const route = useRoute()

const exercises = ref<ExerciseTableData[]>([])
const exercisesOld: Map<number, ExerciseTableData> = new Map()

const { notifications, addNotification } = useNotifications()

const workSetConnector = new WorkSetConnector()
const exerciseConnector = new ExerciseConnector()
const exerciseCountConnector = new ExerciseCountConnector()

const timeslotId = Number(route.params.id)

function doUpdate<T extends Diff>(data: T, updateType: ExerciseUpdateType): Promise<unknown> {
  if (updateType === ExerciseUpdateType.WorkSet && isWorkSetDiff(data)) {
    return workSetConnector.put(data)
  } else if (updateType === ExerciseUpdateType.Exercise && isExerciseDiff(data)) {
    return exerciseConnector.put(data)
  } else if (updateType === ExerciseUpdateType.WorkSetCount && isWorkSetCountDiff(data)) {
    return handleCountUpdate(data).finally(() => {
      exercises.value.forEach((e) => addWatchToRow(e))
    })
  } else {
    return Promise.reject(new Error("Invalid data or update type"))
  }
}

async function handleCountUpdate(diff: WorkSetCountDiff): Promise<unknown> {
  const exercisesCopy: ExerciseTableData[] = deepClone(exercises.value)
  const exercise_work_sets = exercises.value.filter((e) => e.exercise_id === diff.id)

  if (exercise_work_sets.length === 0) {
    throw new Error(`No such exercise with id ${diff.id}`)
  }
  const last_work_set = exercise_work_sets[exercise_work_sets.length - 1]
  const oldCount = exercisesOld.get(last_work_set.work_set_id)?.work_set_count as number

  if (diff.work_set_count >= oldCount) {
    return increaseWorkSets(
      diff,
      oldCount,
      exercises,
      exercisesCopy,
      exercisesOld,
      last_work_set,
      exerciseCountConnector,
    )
  } else if (diff.work_set_count < oldCount) {
    return decreaseWorkSets(
      diff,
      oldCount,
      exercises,
      exercisesCopy,
      exercisesOld,
      exercise_work_sets,
      exerciseCountConnector,
    )
  } else {
    throw new Error("chaos")
  }
}

function handlePromise(promise: Promise<unknown>) {
  promise
    .then(() => addNotification("Update succesful", "success"))
    .catch((error: Error) => addNotification(error.message, "error"))
}

function updateTable(newRow: ExerciseTableData) {
  const [diff, updateType] = tableDataDiff(
    newRow,
    exercisesOld.get(newRow.work_set_id) as ExerciseTableData,
  )

  if (!diff || !updateType) {
    return
  }

  doUpdate(diff, updateType)
    .then(() => addNotification("Update succesful", "success"))
    .catch((error: Error) => addNotification(error.message, "error"))
    .finally(() => exercisesOld.set(newRow.work_set_id, deepClone(newRow)))
}

function addExercise() {
  const groupId =
    exercises.value.length !== 0 ? exercises.value[exercises.value.length - 1].group_id + 1 : 0
  handlePromise(
    exerciseConnector
      .post({ group_id: groupId, timeslot_id: timeslotId })
      .then((response) => addNewTableData(response)),
  )
}

function deleteExercise(groupId: number) {
  handlePromise(
    exerciseConnector.delete({ group_id: groupId, timeslot_id: timeslotId }).then(() => {
      let exercisesCopy: ExerciseTableData[] = deepClone(exercises.value)
      exercisesCopy = exercisesCopy.filter((e) => e.group_id !== groupId)
      exercises.value = exercisesCopy
    }),
  )
}

function addWatchToRow(row: ExerciseTableData) {
  watchDebounced(
    row,
    async () => {
      updateTable(row)
    },
    {
      deep: true,
      debounce: 10000,
      maxWait: 10000,
    },
  )
}

function addNewTableData(apiRow: ExerciseResponse) {
  const tableData = exerciseToTableData(apiRow)
  tableData.forEach((row) => {
    exercises.value.push(row)
    exercisesOld.set(row.work_set_id, deepClone(row))
    // NOTE: Add persistent storage so that a reload doesn't cancel data
    addWatchToRow(exercises.value[exercises.value.length - 1])
  })
}
exerciseConnector.get(timeslotId).then((exercise) => {
  exercise.forEach((e) => addNewTableData(e))
})
</script>

<template>
  <NotificationFloat :notifications="notifications" />

  <ExerciseTable
    :columns="EXERCISE_COLUMNS"
    :exercises="exercises"
    @update-table="updateTable"
    @delete-exercise="deleteExercise"
  />
  <v-btn text="Add exercise" @click="addExercise()" />
</template>
