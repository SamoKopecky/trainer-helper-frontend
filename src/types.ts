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

export interface WorkSetTableRow {
  key: string
  type: string | null
  name: string
}

export enum SetType {
  Squat = "Squat",
  Rdl = "Rdl",
}

export interface ExerciseTableData {
  exercise_id: number | null
  group_id: number
  set_type: SetType | null
  work_set_count: number | null
  note: string | null
  work_set_id: number
  reps: number
  intensity: string
  rpe: number | null
}
