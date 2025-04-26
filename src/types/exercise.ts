import type { WorkSet } from "./other"

export interface Exercise {
  id: number
  group_id: number
  note?: string
  exercise_type_id?: number
  work_set_count: number
}

export interface ExerciseTableColumn {
  key: keyof ExerciseTableData | "delete"
  type: "special" | "number" | "text"
  name: string
  isMultirow: boolean
  align: "center" | "left"
}

export enum ExerciseUpdateType {
  Exercise = "Exercise",
  GroupId = "GroupId",
  WorkSet = "WorkSet",
  WorkSetCount = "WorkSetCount",
}

export interface Diff {
  updateType: ExerciseUpdateType
  id: number
  newValue: any
  oldValue: any
  changedKey: keyof ExerciseTableData
  idKey: keyof ExerciseTableData
}

export interface ExerciseTableData extends Omit<WorkSet, "id">, Omit<Exercise, "id"> {
  work_set_id: number
  is_main: boolean
  work_set_count_display: number
}
