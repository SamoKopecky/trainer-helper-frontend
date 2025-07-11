import type { WeekDay } from "./block"
import type { CalDisplayTimeslot, DisplayTimeslot } from "./calendar"
import type { User } from "./user"

export interface WorkSet {
  id: number
  exercise_id: number
  reps: number
  intensity: string
  rpe?: string
}

export interface Timeslot {
  id: number
  trainer_id: string
  trainee_id?: string
  end: Date
  start: Date
}

export interface EnhancedTimeslot extends Timeslot {
  user?: User
  week_day?: WeekDay
}

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}

export function isDisplayTimeslot(timeslot: object): timeslot is DisplayTimeslot {
  return (
    "title" in timeslot && "class" in timeslot && "content" in timeslot && !("delete" in timeslot)
  )
}

export function isCalDisplayTimeslot(timeslot: object): timeslot is CalDisplayTimeslot {
  return "title" in timeslot && "class" in timeslot && "content" in timeslot && "delete" in timeslot
}
