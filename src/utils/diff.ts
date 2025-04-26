import { ExerciseUpdateType, type Diff, type ExerciseTableData } from "@/types/exercise"

const DATA_DIFF_MAP: Record<keyof ExerciseTableData, ExerciseUpdateType | null> = {
  note: ExerciseUpdateType.Exercise,
  reps: ExerciseUpdateType.WorkSet,
  intensity: ExerciseUpdateType.WorkSet,
  rpe: ExerciseUpdateType.WorkSet,
  is_main: null,
  group_id: ExerciseUpdateType.GroupId,
  exercise_type_id: ExerciseUpdateType.Exercise,
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

export function tableDataDiff(newObj: ExerciseTableData, oldObj: ExerciseTableData): Diff | null {
  let newValue: any | null = null
  let oldValue: any | null = null
  let changedKey: keyof ExerciseTableData | null = null

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      newValue = newObj[key]
      oldValue = oldObj[key]
      changedKey = key as keyof ExerciseTableData
      break
    }
  }

  if (!changedKey) {
    return null
  }
  const updateType = DATA_DIFF_MAP[changedKey]

  if (!updateType) {
    return null
  }
  const updateIdKey = UPDATE_TYPE_ID_MAP[updateType]

  return {
    updateType: updateType,
    oldValue: oldValue,
    newValue: newValue,
    changedKey: changedKey,
    id: newObj[updateIdKey] as number,
  }
}
