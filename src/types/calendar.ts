import type { EnhancedTimeslot } from "./other"
import type { VueCalTimeslot } from "./vuecal"

export interface DisplayTimeslot extends EnhancedTimeslot {
  title?: string
  content?: string
  class: string
}

export interface CalDisplayTimeslot extends VueCalTimeslot, DisplayTimeslot {}
