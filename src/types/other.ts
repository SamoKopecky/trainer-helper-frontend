import { exerciseType } from "./exercises"

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
  note: string | null
  exercise_type: exerciseType
  work_set_count: number
}

export interface Timeslot {
  id: number
  trainer_id: string
  trainee_id: string | null
  person_name?: string
  name: string
  end: Date
  start: Date
}

export interface Person {
  id: string
  name: string
  email: string
}

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}

export interface ExerciseType {
  id: number
  user_id: string
  name: string
  note?: string
  media_type?: MediaType
  media_address?: string
}

export interface ExerciseTypeTableRow {
  name: string
  has_media: boolean
  media_type: MediaType
}

export enum MediaType {
  Youtube = "YOUTUBE",
  File = "FILE",
}
