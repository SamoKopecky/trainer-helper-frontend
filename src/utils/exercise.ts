import {
  ExerciseUpdateType,
  type ExerciseTableData,
  type ExerciseTableColumn,
  type ExerciseDiff,
} from "../types"
import type { Exercise, ExerciseWorkSet } from "../backend-helpers/exercise"

export function deepClone(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

const DATA_DIFF_MAP: Record<keyof ExerciseTableData, ExerciseUpdateType | null> = {
  note: ExerciseUpdateType.Exercise,
  reps: ExerciseUpdateType.WorkSet,
  intensity: ExerciseUpdateType.WorkSet,
  rpe: ExerciseUpdateType.WorkSet,
  is_main: null,
  group_id: null,
  set_type: null,
  exercise_id: null,
  work_set_id: null,
  work_set_count: null,
}

const UPDATE_TYPE_ID_MAP: Record<ExerciseUpdateType, keyof ExerciseTableData> = {
  Exercise: "exercise_id",
  WorkSet: "work_set_id",
}

export function tableDataDiff(
  newObj: ExerciseTableData,
  oldObj: ExerciseTableData,
): [ExerciseDiff | null, ExerciseUpdateType | null] {
  const res: Partial<ExerciseDiff> = {}
  let changedKey: keyof ExerciseTableData | null = null

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      res[key] = newObj[key]
      changedKey = key as keyof ExerciseTableData
      break
    }
  }

  if (!changedKey) {
    return [null, null]
  }
  const updateType = DATA_DIFF_MAP[changedKey]

  if (!updateType) {
    return [null, null]
  }
  const updateIdKey = UPDATE_TYPE_ID_MAP[updateType]

  res.id = newObj[updateIdKey] as number
  return [res as ExerciseDiff, updateType]
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

export function getRowspan(row: ExerciseTableData, column: ExerciseTableColumn): number {
  if (row.is_main && column.is_multirow) {
    return row.work_set_count
  }
  return 1
}

export function getColumns(
  columns: ExerciseTableColumn[],
  row: ExerciseTableData,
): ExerciseTableColumn[] {
  if (!row.is_main) {
    return columns.filter((row) => !row.is_multirow)
  }
  return columns
}
