import type { WeekDay } from "./block"
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
  end: Date
  start: Date
  user?: User
  week_day?: WeekDay
}

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}
