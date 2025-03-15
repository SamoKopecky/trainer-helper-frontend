import type { Timeslot } from "./other"
import type { VueCalTimeslot } from "./vuecal"

export interface AppTimeslot extends Timeslot {
  title: string
  class: string
}

export interface CalTimeslot extends VueCalTimeslot, AppTimeslot {}
