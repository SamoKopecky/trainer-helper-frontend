import {
  type ExerciseTableData,
  type ExerciseTableColumn,
  type WorkSet,
  type WorkSetCountDiff,
} from "@/types"
import type { ExerciseResponse } from "@/backendHelpers/exercise"
import type { ExerciseCountConnector } from "@/backendHelpers/exerciseCount"
import type { Ref } from "vue"

export function deepClone(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

export function exerciseToTableData(data: ExerciseResponse): ExerciseTableData[] {
  return data.work_sets.map((e: WorkSet, index: number): ExerciseTableData => {
    return {
      is_main: index === 0,
      intensity: e.intensity,
      rpe: e.rpe,
      note: data.note,
      reps: e.reps,
      group_id: data.group_id,
      set_type: data.set_type,
      exercise_id: data.exercise_id,
      work_set_id: e.work_set_id,
      work_set_count: data.work_set_count,
      // Needs to be updated manually
      work_set_count_display: data.work_set_count,
    }
  })
}

export async function increaseWorkSets(
  diff: WorkSetCountDiff,
  oldCount: number,
  exercisesLive: Ref<ExerciseTableData[]>,
  exercisesCopy: ExerciseTableData[],
  exercisesOld: Map<number, ExerciseTableData>,
  last_work_set: ExerciseTableData,
  exerciseCountConnector: ExerciseCountConnector,
): Promise<void> {
  const indexStart = exercisesLive.value.indexOf(last_work_set) + 1
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
    exercisesLive.value = exercisesCopy
  })
}

export async function decreaseWorkSets(
  diff: WorkSetCountDiff,
  oldCount: number,
  exercisesLive: Ref<ExerciseTableData[]>,
  exercisesCopy: ExerciseTableData[],
  exercisesOld: Map<number, ExerciseTableData>,
  exercise_work_sets: ExerciseTableData[],
  exerciseCountConnector: ExerciseCountConnector,
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
    exercisesLive.value = exercisesCopy
  })
}
