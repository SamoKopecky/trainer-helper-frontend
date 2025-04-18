export interface WorkSet {
  id: number
  exercise_id: number
  reps: number
  intensity: string
  rpe: number | null
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

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}
