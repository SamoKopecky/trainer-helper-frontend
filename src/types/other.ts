export interface WorkSet {
  id: number
  exercise_id: number
  reps: number
  intensity: string
  rpe: number | null
}

export interface Exercise {
  id: number
  group_id: number
  note?: string
  exercise_type_id?: number
  work_set_count: number
}

export interface Timeslot {
  id: number
  trainer_id: string
  trainee_id: string | null
  user_name?: string
  name: string
  end: Date
  start: Date
}

export interface User {
  id: string
  name: string
  email: string
}

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}

export interface ExerciseType extends ExerciseTypeUpdate {
  id: number
  user_id: string
  name: string
}

export interface ExerciseTypeUpdate {
  note?: string
  media_type?: MediaType
  media_address?: string
}

export interface ExerciseTypeTableRow {
  id: number
  name: string
  hasMedia: boolean
  hasMediaVal: string
  mediaType?: MediaType
}

export enum MediaType {
  Youtube = "YOUTUBE",
  File = "FILE",
}
