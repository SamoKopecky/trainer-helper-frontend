import { type ExerciseTableData } from "@/types"
import type { WorkSetPutRequest } from "../backend-helpers/worksets"
import type { Exercise, ExerciseWorkSet } from "@/backend-helpers/exercise"

export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function workSetDiff(
  newObj: ExerciseTableData,
  oldObj: ExerciseTableData,
): WorkSetPutRequest | null {
  const res: Partial<WorkSetPutRequest> = {}

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      res[key] = newObj[key]
    }
  }

  if (Object.keys(res).length > 0) {
    res["id"] = newObj.work_set_id
    return res as WorkSetPutRequest
  }
  return null
}

export function randomId(): string {
  return (Math.random() + 1).toString(36).substring(2)
}

export function exerciseToTableData(data: Exercise): ExerciseTableData[] {
  return data.work_sets.map((e: ExerciseWorkSet, index: number): ExerciseTableData => {
    if (index === 0) {
      return {
        intensity: e.intensity,
        rpe: e.rpe,
        note: data.note,
        reps: e.reps,
        group_id: data.group_id,
        set_type: data.set_type,
        exercise_id: data.exercise_id,
        work_set_id: e.work_set_id,
        work_set_count: data.work_set_count,
      }
    }
    return {
      intensity: e.intensity,
      rpe: e.rpe,
      note: null,
      reps: e.reps,
      group_id: data.group_id,
      set_type: null,
      exercise_id: null,
      work_set_id: e.work_set_id,
      work_set_count: null,
    }
  })
}
