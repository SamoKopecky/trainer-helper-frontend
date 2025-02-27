import { type ExerciseTableData, type WorkSet, type WorkSetModel } from "@/types"
import type { ExerciseResponse } from "@/backendHelpers/exercise"

export function deepClone(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

export function responseToTableData(response: ExerciseResponse): ExerciseTableData[] {
  return response.work_sets.map(
    (e: WorkSet, index: number): ExerciseTableData => ({
      is_main: index === 0,
      intensity: e.intensity,
      rpe: e.rpe,
      note: response.note,
      reps: e.reps,
      group_id: response.group_id,
      set_type: response.set_type,
      exercise_id: response.exercise_id,
      work_set_id: e.work_set_id,
      work_set_count: response.work_set_count,
      // Needs to be updated manually
      work_set_count_display: response.work_set_count,
    }),
  )
}

export function tableDataToWorkSet(data: ExerciseTableData): WorkSet {
  return {
    work_set_id: data.work_set_id,
    rpe: data.rpe,
    reps: data.reps,
    intensity: data.intensity,
  }
}

export function mergeTableDataAndWorkSetModel(
  data: ExerciseTableData,
  work_set: WorkSetModel,
  is_main: boolean,
  count: number,
): ExerciseTableData {
  return {
    work_set_id: work_set.work_set_id,
    intensity: work_set.intensity,
    reps: work_set.reps,
    rpe: work_set.rpe,
    exercise_id: work_set.exercise_id,
    note: data.note,
    group_id: data.group_id,
    set_type: data.set_type,
    is_main: is_main,
    work_set_count: count,
    work_set_count_display: count,
  }
}
