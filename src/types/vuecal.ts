import { type AppTimeslot } from "./calendar"

export interface VueCalView {
  createEvent(event: AppTimeslot): void
}

export interface VueCalRef {
  view: VueCalView
}

export interface VueCalDate extends Date {
  toISOString(): string
}

export interface UnresolvedVueCalTimeslot {
  start: VueCalDate
  end: VueCalDate
}

export interface VueCalTimeslot extends UnresolvedVueCalTimeslot {
  delete(type: number): void
}

export interface UnresolvedCalTimeslot extends UnresolvedVueCalTimeslot, AppTimeslot {}
