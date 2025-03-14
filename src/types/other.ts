import { SetType } from "./exercises"

export interface WorkSet {
  work_set_id: number
  reps: number
  intensity: string
  rpe: number | null
}

export interface WorkSetModel extends WorkSet {
  exercise_id: number
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
  person_name: string | null
  name: string
  end: Date
  start: Date
}

export interface Person {
  id: number
  name: string
  email: string
}

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}
