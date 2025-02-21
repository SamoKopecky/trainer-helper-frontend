export interface Event {
  start: string
  end: string
  title: string
  content: string
  timeslot_id: number
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

export interface ExerciseTableData {
  is_main: boolean
  exercise_id: number
  group_id: number
  set_type: SetType
  work_set_count: number
  note: string | null
  work_set_id: number
  reps: number
  intensity: string
  rpe: number | null
}

export enum ExerciseUpdateType {
  Exercise = "Exercise",
  WorkSet = "WorkSet",
}

export enum SetType {
  Squat = "Squat",
  Rdl = "Rdl",
}

export interface ExerciseDiff {
  id: number | null
  note: string | null
  rpe: number | null
  intensity: string | null
  reps: number | null
}
