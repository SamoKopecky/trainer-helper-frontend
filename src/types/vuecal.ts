import { type AppTimeslot } from "./calendar"

export interface VueCalView {
  createEvent(event: AppTimeslot): void
}

export interface VueCalRef {
  view: VueCalView
}

export interface UnresolvedVueCalTimeslot {
  start: Date
  end: Date
}

export interface VueCalTimeslot extends UnresolvedVueCalTimeslot {
  delete(type: number): void
}

export interface UnresolvedCalTimeslot extends UnresolvedVueCalTimeslot, AppTimeslot {}
