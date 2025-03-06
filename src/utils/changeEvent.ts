import type { CalendarEvent } from "@/types"

export interface ChangeEvent {
  up(): void
  down(): void
}

export enum CalendarChange {
  CREATE,
  DELETE,
}

export class CalendarChangeEvent implements ChangeEvent {
  private newEvent: CalendarEvent
  private changeType: CalendarChange
  private events: CalendarEvent[]

  private addEvent(newEvent: CalendarEvent) {
    console.log("calling backend with", newEvent)
    this.events.push(newEvent)
  }

  private addEventOnlyBackend(newEvent: CalendarEvent) {
    console.log("calling backend with only", newEvent)
  }
  private removeEvent(event: CalendarEvent) {
    console.log("calling backend with delete", event)
    this.events.splice(this.events.indexOf(event), 0)
  }

  constructor(newEvent: CalendarEvent, events: CalendarEvent[], changeType: CalendarChange) {
    this.newEvent = newEvent
    this.changeType = changeType
    this.events = events
  }

  public up(): void {
    switch (this.changeType) {
      case CalendarChange.CREATE:
        this.addEventOnlyBackend(this.newEvent)
        break
      case CalendarChange.DELETE:
        this.removeEvent(this.newEvent)
        break
    }
  }

  public down(): void {
    switch (this.changeType) {
      case CalendarChange.CREATE:
        this.removeEvent(this.newEvent)
        break
      case CalendarChange.DELETE:
        this.addEvent(this.newEvent)
        break
    }
  }
}
