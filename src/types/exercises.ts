import type { Exercise, WorkSet } from "./other"

export interface ExerciseTableColumn {
  key: string
  type: string | null
  name: string
  is_multirow: boolean
}

export enum ExerciseUpdateType {
  Exercise = "Exercise",
  GroupId = "GroupId",
  WorkSet = "WorkSet",
  WorkSetCount = "WorkSetCount",
}

export enum SetType {
  Squat = "Squat",
  Rdl = "Rdl",
  Deadlift = "Deadlift",
  None = "None",
}

export interface Diff {
  id: number
}

export interface ExerciseDiff extends Diff {
  note?: string
  set_type: SetType | null
}

export interface WorkSetDiff extends Diff {
  rpe: number | null
  intensity: string | null
  reps: number | null
}

export interface GroupIdDiff extends Diff {
  group_id?: number
}

export interface WorkSetCountDiff extends Diff {
  work_set_count: number
}

export interface ExerciseTableData extends WorkSet, Exercise {
  is_main: boolean
  work_set_count_display: number
}
