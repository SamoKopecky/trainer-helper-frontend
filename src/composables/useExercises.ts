import {
  deepClone,
  mergeTableDataAndWorkSetModel,
  responseToTableData,
  tableDataToWorkSet,
} from "@/utils/tranformators"
import { ref } from "vue"
import {
  ExerciseUpdateType,
  type ExerciseTableData,
  type Diff,
  type WorkSetCountDiff,
  type NotificationType,
} from "@/types"
import { ExerciseService, type ExerciseResponse } from "@/services/exercise"
import { WorkSetService } from "@/services/worksets"
import { ExerciseCountService } from "@/services/exerciseCount"
import { isExerciseDiff, isWorkSetCountDiff, isWorkSetDiff, tableDataDiff } from "@/utils/diff"
import { onMounted } from "vue"

export function useExercises(
  timeslotId: number,
  addNotification: (text: string, type: NotificationType) => void,
) {
  const workSetService = new WorkSetService()
  const exerciseService = new ExerciseService()
  const exerciseCountService = new ExerciseCountService()

  const exercises = ref<ExerciseTableData[]>([])
  const exercisesOld: Map<number, ExerciseTableData> = new Map()

  async function doUpdate<T extends Diff>(
    data: T,
    updateType: ExerciseUpdateType,
  ): Promise<unknown> {
    if (updateType === ExerciseUpdateType.WorkSet && isWorkSetDiff(data)) {
      return workSetService.put(data)
    } else if (updateType === ExerciseUpdateType.Exercise && isExerciseDiff(data)) {
      return exerciseService.put(data)
    } else if (updateType === ExerciseUpdateType.WorkSetCount && isWorkSetCountDiff(data)) {
      return countUpdate(data)
    } else {
      return Promise.reject(new Error("Invalid data or update type"))
    }
  }

  async function increaseWorkSets(
    diff: WorkSetCountDiff,
    oldCount: number,
    exercise: ExerciseTableData,
  ): Promise<void> {
    const indexStart = exercises.value.indexOf(exercise) + 1
    const request = {
      id: diff.id,
      count: diff.work_set_count - oldCount,
      work_set_template: tableDataToWorkSet(exercise),
    }

    // This is kind of inneficient, can be reworked to be faster
    return exerciseCountService.put(request).then((response) => {
      response.forEach((row, i) =>
        exercises.value.splice(
          indexStart + i,
          0,
          mergeTableDataAndWorkSetModel(exercise, row, false, diff.work_set_count),
        ),
      )
      exercises.value
        .filter((row) => row.exercise_id === diff.id)
        .forEach((row) => {
          row.work_set_count_display = diff.work_set_count
          row.work_set_count = diff.work_set_count
          exercisesOld.set(row.work_set_id, deepClone(row))
        })
    })
  }

  async function decreaseWorkSets(
    diff: WorkSetCountDiff,
    oldCount: number,
    exercise_work_sets: ExerciseTableData[],
  ): Promise<void> {
    const sorted = exercise_work_sets.sort((w) => w.work_set_id)
    const toRemoveIds = sorted.slice(0, oldCount - diff.work_set_count).map((w) => w.work_set_id)
    return exerciseCountService.delete({ work_set_ids: toRemoveIds }).then((removed) => {
      if (toRemoveIds.length !== removed) {
        throw new Error(`Deleted ${removed} != ${toRemoveIds.length}`)
      }

      exercises.value = exercises.value.filter((e) => !toRemoveIds.includes(e.work_set_id))
      toRemoveIds.forEach((id) => exercisesOld.delete(id))
      exercises.value
        .filter((row) => row.exercise_id === diff.id)
        .forEach((row) => {
          row.work_set_count_display = diff.work_set_count
          row.work_set_count = diff.work_set_count
          exercisesOld.set(row.work_set_id, deepClone(row))
        })
    })
  }

  async function countUpdate(diff: WorkSetCountDiff): Promise<void> {
    const exercise_work_sets = exercises.value.filter((e) => e.exercise_id === diff.id)

    if (exercise_work_sets.length === 0) {
      throw new Error(`No such exercise with id ${diff.id}`)
    }
    const last_work_set = exercise_work_sets[exercise_work_sets.length - 1]
    const oldCount = exercisesOld.get(last_work_set.work_set_id)?.work_set_count as number

    if (diff.work_set_count >= oldCount) {
      return increaseWorkSets(diff, oldCount, last_work_set)
    } else {
      return decreaseWorkSets(diff, oldCount, exercise_work_sets)
    }
  }

  function addNewTableData(response: ExerciseResponse) {
    responseToTableData(response).forEach((row) => {
      exercises.value.push(row)
      exercisesOld.set(row.work_set_id, deepClone(row))
    })
  }

  onMounted(() => {
    exerciseService.get(timeslotId).then((exercise) => exercise.forEach((e) => addNewTableData(e)))
  })

  function addExercise() {
    const groupId =
      exercises.value.length !== 0 ? exercises.value[exercises.value.length - 1].group_id + 1 : 0
    handlePromise(
      exerciseService
        .post({ group_id: groupId, timeslot_id: timeslotId })
        .then((response) => addNewTableData(response)),
    )
  }

  function deleteExercise(groupId: number) {
    handlePromise(
      exerciseService.delete({ group_id: groupId, timeslot_id: timeslotId }).then(() => {
        exercises.value = exercises.value.filter((e) => e.group_id !== groupId)
      }),
    )
  }

  function updateTable(newRow: ExerciseTableData) {
    const oldRow = exercisesOld.get(newRow.work_set_id)
    if (!oldRow) {
      throw new Error("Internal error old row not found")
    }

    const [diff, updateType] = tableDataDiff(newRow, oldRow)

    if (!diff || !updateType) {
      return
    }

    handlePromise(doUpdate(diff, updateType)).finally(() =>
      exercisesOld.set(newRow.work_set_id, deepClone(newRow)),
    )
  }

  async function handlePromise(promise: Promise<unknown>): Promise<unknown> {
    return promise
      .then(() => addNotification("Update succesful", "success"))
      .catch((error: Error) => addNotification(error.message, "error"))
  }

  return { exercises, addExercise, deleteExercise, updateTable }
}
