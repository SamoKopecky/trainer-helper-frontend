<script setup lang="ts">
import { deepClone, exerciseToTableData } from "@/utils/exerciseView"
import { ref } from "vue"
import { useRoute } from "vue-router"
import {
  ExerciseUpdateType,
  type ExerciseTableData,
  type ExerciseTableColumn,
  type Diff,
  type WorkSetCountDiff,
  type WorkSet,
} from "@/types"
import { ExerciseConnector, type ExerciseResponse } from "@/backendHelpers/exercise"
import { WorkSetConnector } from "@/backendHelpers/worksets"
import { ExerciseCountConnector } from "@/backendHelpers/exerciseCount"
import { isExerciseDiff, isWorkSetCountDiff, isWorkSetDiff, tableDataDiff } from "@/utils/diff"
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "../components/NotificationFloat.vue"
import ExerciseTable from "../components/ExerciseTable.vue"

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

async function doUpdate<T extends Diff>(data: T, updateType: ExerciseUpdateType): Promise<unknown> {
  if (updateType === ExerciseUpdateType.WorkSet && isWorkSetDiff(data)) {
    return workSetConnector.put(data)
  } else if (updateType === ExerciseUpdateType.Exercise && isExerciseDiff(data)) {
    return exerciseConnector.put(data)
  } else if (updateType === ExerciseUpdateType.WorkSetCount && isWorkSetCountDiff(data)) {
    return handleCountUpdate(data)
  } else {
    return Promise.reject(new Error("Invalid data or update type"))
  }
}

async function increaseWorkSets(
  diff: WorkSetCountDiff,
  oldCount: number,
  exercisesCopy: ExerciseTableData[],
  last_work_set: ExerciseTableData,
): Promise<void> {
  const indexStart = exercises.value.indexOf(last_work_set) + 1
  const request = {
    id: diff.id,
    count: diff.work_set_count - oldCount,
    work_set_template: {
      work_set_id: last_work_set.work_set_id,
      rpe: last_work_set.rpe,
      reps: last_work_set.reps,
      intensity: last_work_set.intensity,
    } as WorkSet,
  }
  return exerciseCountConnector.put(request).then((response) => {
    response.forEach((row, i) => {
      const newRow: ExerciseTableData = {
        work_set_id: row.work_set_id,
        intensity: row.intensity,
        reps: row.reps,
        rpe: row.rpe,
        exercise_id: row.exercise_id,
        note: last_work_set.note,
        work_set_count: diff.work_set_count,
        group_id: last_work_set.group_id,
        set_type: last_work_set.set_type,
        is_main: false,
        work_set_count_display: diff.work_set_count,
      }
      exercisesCopy.splice(indexStart + i, 0, newRow)
    })
    exercisesCopy
      .filter((row) => row.exercise_id === diff.id)
      .forEach((row) => {
        row.work_set_count_display = diff.work_set_count
        row.work_set_count = diff.work_set_count
        exercisesOld.set(row.work_set_id, deepClone(row))
      })
    exercises.value = exercisesCopy
  })
}

async function decreaseWorkSets(
  diff: WorkSetCountDiff,
  oldCount: number,
  exercisesCopy: ExerciseTableData[],
  exercise_work_sets: ExerciseTableData[],
): Promise<void> {
  const sorted = exercise_work_sets.sort((w) => w.work_set_id)
  const toRemoveIds = sorted.slice(0, oldCount - diff.work_set_count).map((w) => w.work_set_id)
  return exerciseCountConnector.delete({ work_set_ids: toRemoveIds }).then((removed) => {
    // TODO: Remove exercises from exercisesOld map
    if (toRemoveIds.length !== removed) {
      throw new Error(`Deleted ${removed} != ${toRemoveIds.length}`)
    }
    exercisesCopy = exercisesCopy.filter((e) => !toRemoveIds.includes(e.work_set_id))
    exercisesCopy
      .filter((row) => row.exercise_id === diff.id)
      .forEach((row) => {
        row.work_set_count_display = diff.work_set_count
        row.work_set_count = diff.work_set_count
        exercisesOld.set(row.work_set_id, deepClone(row))
      })
    exercises.value = exercisesCopy
  })
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
    return increaseWorkSets(diff, oldCount, exercisesCopy, last_work_set)
  } else if (diff.work_set_count < oldCount) {
    return decreaseWorkSets(diff, oldCount, exercisesCopy, exercise_work_sets)
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

function addNewTableData(apiRow: ExerciseResponse) {
  const tableData = exerciseToTableData(apiRow)
  tableData.forEach((row) => {
    exercises.value.push(row)
    exercisesOld.set(row.work_set_id, deepClone(row))
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
