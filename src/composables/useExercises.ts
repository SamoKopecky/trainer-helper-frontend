import { deepClone, responseToTableData } from "@/utils/tranformators"
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
import type { ChangeEvent } from "@/changeEvents/base"
import { GroupExerciseTableUpdate } from "@/changeEvents/exerciseTable/groupUpdate"
import { SingleExerciseTableUpdate } from "@/changeEvents/exerciseTable/singleUpdate"
import { ExerciseExerciseTableDelete } from "@/changeEvents/exerciseTable/exerciseDelete"
import { CopyWorkSetExerciseTableUpdate } from "@/changeEvents/exerciseTable/copyWorkSet"
import { SetCountExerciseTableUpdate } from "@/changeEvents/exerciseTable/setCount"

export function useExercises(
  timeslotId: number,
  exerciseRes: Ref<FullExerciseResponse | undefined>,
  addNotification: (text: string, type: NotificationType) => void,
  addChangeEvent: (event: ChangeEvent) => void,
) {
  const exerciseService = new ExerciseService()
  const timeslotService = new TimeslotService()

  const exercises = ref<ExerciseTableData[]>([])
  const exercisesOld: Map<number, ExerciseTableData> = new Map()

  function deleteExercise(exerciseId: number) {
    addChangeEvent(new ExerciseExerciseTableDelete(exerciseId, exercises.value, exercisesOld))
  }

  function copyWorkSet(row: ExerciseTableData, key: string) {
    addChangeEvent(new CopyWorkSetExerciseTableUpdate(row, key, exercises.value, exercisesOld))
  }

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
        addChangeEvent(
          new SetCountExerciseTableUpdate(diff as DiffNumber, exercises.value, exercisesOld),
        )
        break
      default:
        return Promise.reject(new Error("Invalid data or update type"))
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
