export interface Event {
  start: string
  end: string
  title: string
  content: string
  timeslot_id: number
}

export interface WorkSet {
  work_set_id: number
  reps: number
  intensity: string
  rpe: number | null
}

export interface Exercise {
  exercise_id: number
  group_id: number
  note: string | null
  set_type: SetType
  work_set_count: number
}

export interface Timeslot {
  id: number
  trainer_id: number
  user_id: number | null
  duration: number
  start: Date
}

export interface ChangeNotification {
  type: "success" | "info" | "warning" | "error" | undefined
  text: string
}

export interface ExerciseTableColumn {
  key: string
  type: string | null
  name: string
  is_multirow: boolean
}

export enum ExerciseUpdateType {
  Exercise = "Exercise",
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
  note: string | null
  set_type: SetType | null
}

export interface WorkSetDiff extends Diff {
  rpe: number | null
  intensity: string | null
  reps: number | null
}

export interface WorkSetCountDiff extends Diff {
  work_set_count: number
}

export interface ExerciseTableData extends WorkSet, Exercise {
  is_main: boolean
  work_set_count_display: number
}

export interface WorkSetModel extends WorkSet {
  exercise_id: number
}
