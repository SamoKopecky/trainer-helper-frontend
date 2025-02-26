import { type ExerciseTableData, type WorkSet } from "@/types"
import type { ExerciseResponse } from "@/backendHelpers/exercise"

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
