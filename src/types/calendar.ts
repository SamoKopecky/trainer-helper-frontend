import type { VueCalTimeslot } from "./vuecal"

export interface AppTimeslot {
  start: Date
  end: Date
  title: string
  timeslot_id: number
}

export interface CalTimeslot extends VueCalTimeslot, AppTimeslot {}
