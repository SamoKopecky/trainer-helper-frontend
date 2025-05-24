import type { WorkSet } from "./other"

export interface Exercise {
  id: number
  week_day_id: number
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

export interface DiffString extends DiffBase {
  newValue: string | null
  oldValue: string | null
}

export interface DiffNumber extends DiffBase {
  newValue: number | null
  oldValue: number | null
}

export type Diff = DiffString | DiffNumber
export type DiffValue = string | number | null

export interface DiffBase {
  id: number
  idKey: keyof ExerciseTableData
  updateType: ExerciseUpdateType
  changedKey: keyof ExerciseTableData
}

export interface ExerciseTableData extends Omit<WorkSet, "id">, Omit<Exercise, "id"> {
  work_set_id: number
  is_main: boolean
  work_set_count_display: number
}
