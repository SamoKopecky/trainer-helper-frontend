import type { User } from "./user"

export interface WorkSet {
  id: number
  exercise_id: number
  reps: number
  intensity: string
  rpe?: number
}

export interface Timeslot {
  id: number
  trainer_id: string
  trainee_id?: string
  name: string
  end: Date
  start: Date
  user?: User
}

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}
