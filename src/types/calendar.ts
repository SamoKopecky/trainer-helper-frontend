import type { VueCalTimeslot } from "./vuecal"

export interface AppTimeslot {
  title: string
  content: string
  timeslot_id: number
}

export interface CalTimeslot extends VueCalTimeslot, AppTimeslot {}
