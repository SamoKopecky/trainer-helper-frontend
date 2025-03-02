import {
  ExerciseUpdateType,
  type ExerciseTableData,
  type ExerciseDiff,
  type Diff,
  type WorkSetDiff,
  type WorkSetCountDiff,
  type GroupIdDiff,
} from "../types"

const DATA_DIFF_MAP: Record<keyof ExerciseTableData, ExerciseUpdateType | null> = {
  note: ExerciseUpdateType.Exercise,
  reps: ExerciseUpdateType.WorkSet,
  intensity: ExerciseUpdateType.WorkSet,
  rpe: ExerciseUpdateType.WorkSet,
  is_main: null,
  group_id: ExerciseUpdateType.GroupId,
  set_type: ExerciseUpdateType.Exercise,
  exercise_id: null,
  work_set_id: null,
  work_set_count: ExerciseUpdateType.WorkSetCount,
  work_set_count_display: null,
}

const UPDATE_TYPE_ID_MAP: Record<ExerciseUpdateType, keyof ExerciseTableData> = {
  Exercise: "exercise_id",
  WorkSet: "work_set_id",
  WorkSetCount: "exercise_id",
  GroupId: "exercise_id",
}

export function isWorkSetDiff(data: Diff): data is WorkSetDiff {
  return "rpe" in data || "intensity" in data || "reps" in data
}

export function isExerciseDiff(data: Diff): data is ExerciseDiff {
  return "note" in data || "set_type" in data
}

export function isGroupIdDiff(data: Diff): data is GroupIdDiff {
  return "group_id" in data
}

export function isWorkSetCountDiff(data: Diff): data is WorkSetCountDiff {
  return "work_set_count" in data
}

export function tableDataDiff<T extends Diff>(
  newObj: ExerciseTableData,
  oldObj: ExerciseTableData,
): [T | null, ExerciseUpdateType | null] {
  const res: Partial<T> = {}
  let changedKey: keyof ExerciseTableData | null = null

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      res[key as keyof T] = newObj[key]
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
  return [res as T, updateType]
}
