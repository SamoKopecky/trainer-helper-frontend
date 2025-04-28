import {
  deepClone,
  mergeTableDataAndWorkSetModel,
  responseToTableData,
  tableDataToWorkSet,
} from "@/utils/tranformators"
import { ref, watch } from "vue"
import {
  ExerciseService,
  type ExerciseResponse,
  type FullExerciseResponse,
} from "@/services/exercise"
import { tableDataDiff } from "@/utils/diff"
import { sortRows } from "@/utils/exerciseTable"
import {
  type ExerciseTableData,
  ExerciseUpdateType,
  type Diff,
  type DiffNumber,
} from "@/types/exercise"
import type { NotificationType } from "@/types/other"
import type { Ref } from "vue"
import { TimeslotService } from "@/services/timeslots"
import { GroupExerciseTableUpdate } from "@/changeEvents/exerciseTable/groupUpdate"
import { SingleExerciseTableUpdate } from "@/changeEvents/exerciseTable/singleUpdate"
import type { ChangeEvent } from "@/changeEvents/base"
import { WorkSetService } from "@/services/worksets"
import { ExerciseExerciseTableDelete } from "@/changeEvents/exerciseTable/exerciseDelete"
import { CopyWorkSetExerciseTable } from "@/changeEvents/exerciseTable/copyWorkSet"

export function useExercises(
  timeslotId: number,
  exerciseRes: Ref<FullExerciseResponse | undefined>,
  addNotification: (text: string, type: NotificationType) => void,
  addChangeEvent: (event: ChangeEvent) => void,
) {
  const workSetService = new WorkSetService()
  const exerciseService = new ExerciseService()
  const timeslotService = new TimeslotService()

  const exercises = ref<ExerciseTableData[]>([])
  const exercisesOld: Map<number, ExerciseTableData> = new Map()

  async function doUpdate(diff: Diff): Promise<unknown> {
    switch (diff.updateType) {
      case ExerciseUpdateType.WorkSet:
      case ExerciseUpdateType.Exercise:
        addChangeEvent(new SingleExerciseTableUpdate(diff, exercises.value, exercisesOld))
        break
      case ExerciseUpdateType.GroupId:
        addChangeEvent(
          new GroupExerciseTableUpdate(diff as DiffNumber, exercises.value, exercisesOld),
        )
        break
      case ExerciseUpdateType.WorkSetCount:
        return countUpdate(diff as DiffNumber)
      default:
        return Promise.reject(new Error("Invalid data or update type"))
    }
  }

  async function increaseWorkSets(
    diff: DiffNumber,
    oldCount: number,
    exercise: ExerciseTableData,
  ): Promise<void> {
    if (!diff.newValue) return
    const indexStart = exercises.value.indexOf(exercise) + 1
    const request = {
      count: diff.newValue - oldCount,
      work_set_template: tableDataToWorkSet(exercise),
    }

    // This is kind of inneficient, can be reworked to be faster
    return exerciseService.putCount(request).then((response) => {
      response.forEach((row, i) =>
        exercises.value.splice(
          indexStart + i,
          0,
          mergeTableDataAndWorkSetModel(exercise, row, false, diff.newValue!),
        ),
      )
      exercises.value
        .filter((row) => row.exercise_id === diff.id)
        .forEach((row) => {
          row.work_set_count_display = diff.newValue!
          row.work_set_count = diff.newValue!
          exercisesOld.set(row.work_set_id, deepClone(row))
        })
    })
  }

  async function decreaseWorkSets(
    diff: DiffNumber,
    oldCount: number,
    exercise_work_sets: ExerciseTableData[],
  ): Promise<void> {
    if (!diff.newValue) return
    const sorted = exercise_work_sets.sort((w) => w.work_set_id)
    const toRemoveIds = sorted.slice(0, oldCount - diff.newValue).map((w) => w.work_set_id)
    return exerciseService.deleteCount({ work_set_ids: toRemoveIds }).then((removed) => {
      if (toRemoveIds.length !== removed) {
        throw new Error(`Deleted ${removed} != ${toRemoveIds.length}`)
      }

      exercises.value = exercises.value.filter((e) => !toRemoveIds.includes(e.work_set_id))
      toRemoveIds.forEach((id) => exercisesOld.delete(id))
      exercises.value
        .filter((row) => row.exercise_id === diff.id)
        .forEach((row) => {
          row.work_set_count_display = diff.newValue!
          row.work_set_count = diff.newValue!
          exercisesOld.set(row.work_set_id, deepClone(row))
        })
    })
  }

  async function countUpdate(diff: DiffNumber): Promise<void> {
    if (!diff.newValue) return
    const exercise_work_sets = exercises.value.filter((e) => e.exercise_id === diff.id)

    if (exercise_work_sets.length === 0) {
      throw new Error(`No such exercise with id ${diff.id}`)
    }
    const last_work_set = exercise_work_sets[exercise_work_sets.length - 1]
    const oldCount = exercisesOld.get(last_work_set.work_set_id)?.work_set_count as number

    if (diff.newValue >= oldCount) {
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

  function clearExercises() {
    exercises.value = []
    exercisesOld.clear()
  }

  watch(exerciseRes, () => {
    if (exerciseRes.value) {
      clearExercises()
      exerciseRes.value.exercises.forEach((e) => addNewTableData(e))
      exercises.value.sort((a, b) => sortRows(a, b))
    }
  })

  function addExercise() {
    const groupId =
      exercises.value.length !== 0 ? exercises.value[exercises.value.length - 1].group_id + 1 : 1
    handleError(
      exerciseService
        .post({ group_id: groupId, timeslot_id: timeslotId })
        .then((response) => addNewTableData(response)),
    )
  }

  function deleteExercise(exerciseId: number) {
    addChangeEvent(new ExerciseExerciseTableDelete(exerciseId, exercises.value, exercisesOld))
  }

  function copyWorkSet(row: ExerciseTableData, key: string) {
    addChangeEvent(new CopyWorkSetExerciseTable(row, key, exercises.value, exercisesOld))
  }

  function updateTable(newRow: ExerciseTableData) {
    const oldRow = exercisesOld.get(newRow.work_set_id)
    if (!oldRow) {
      throw new Error("Internal error old row not found")
    }

    const diff = tableDataDiff(newRow, oldRow)

    if (!diff) {
      return
    }
    handleError(doUpdate(diff))
  }

  async function handleError(promise: Promise<unknown>): Promise<unknown> {
    return promise.catch((error: Error) => addNotification(error.message, "error"))
  }

  function updateTitle(title: string | undefined) {
    if (exerciseRes.value && title) {
      exerciseRes.value.timeslot.name = title
      timeslotService.put({ id: timeslotId, name: title })
    }
  }

  return { exercises, addExercise, deleteExercise, updateTable, updateTitle, copyWorkSet }
}
