import { TimeslotService } from "@/services/timeslots"
import type { CalendarEvent, NewCalendarEvent, Timeslot } from "@/types"

export interface ChangeEvent<T> {
  up(): Promise<T>
  down(): void
}

export class CalendarCreateEvent implements ChangeEvent<Timeslot> {
  private newEvent: NewCalendarEvent
  private service: TimeslotService
  public createdEvent?: CalendarEvent

  constructor(newEvent: NewCalendarEvent) {
    this.newEvent = newEvent
    this.service = new TimeslotService()
  }

  public async up(): Promise<Timeslot> {
    return this.service.post({
      trainer_id: 1,
      start: this.newEvent.start.toISOString().split(".")[0],
      duration: 60,
    })
  }

  public down(): void {
    if (!this.createdEvent) {
      throw new Error(
        "Timeslot notexistent while deleting new timeslot, probably caused by a fail in the up function",
      )
    }
    this.service.delete({ timeslot_id: this.createdEvent?.timeslot_id }).then(() => {
      console.log(this.createdEvent)
      this.createdEvent?.delete(3)
    })
  }
}
