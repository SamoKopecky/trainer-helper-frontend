import type { EnhancedTimeslot } from "./other"
import type { VueCalTimeslot } from "./vuecal"

export interface AppTimeslot extends EnhancedTimeslot {
  title?: string
  content?: string
  class: string
}

export interface CalTimeslot extends VueCalTimeslot, AppTimeslot {}
