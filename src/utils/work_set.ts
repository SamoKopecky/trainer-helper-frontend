import { ExerciseUpdateType, type ExerciseTableData } from "@/types"
import type { Exercise, ExerciseWorkSet } from "@/backend-helpers/exercise"

export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function exerciseTableDataDiff(
  newObj: ExerciseTableData,
  oldObj: ExerciseTableData,
): [any, ExerciseUpdateType | null] {
  const res = {}

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      res[key] = newObj[key]
    }
  }

  if (Object.keys(res).length === 0) {
    return [null, null]
  }

  // TODO: This is terrible fix this
  if (Object.keys(res)[0] === "note") {
    res["id"] = newObj.exercise_id
    return [res, ExerciseUpdateType.Exercise]
  }

  res["id"] = newObj.work_set_id
  return [res, ExerciseUpdateType.WorkSet]
}

export function randomId(): string {
  return (Math.random() + 1).toString(36).substring(2)
}

export function exerciseToTableData(data: Exercise): ExerciseTableData[] {
  return data.work_sets.map((e: ExerciseWorkSet, index: number): ExerciseTableData => {
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
    }
  })
}
