import type { DisplayTimeslot, CalDisplayTimeslot } from "@/types/calendar"
import type { ChangeEvent } from "./base"
import { TimeslotService, type TimeslotPutRequest } from "@/services/timeslots"
import { getISODateTimeString } from "@/utils/date"

export class TimeslotMoveEvent implements ChangeEvent {
  private eventsCopy: Map<number, DisplayTimeslot>
  private newTimeslot: CalDisplayTimeslot
  private oldTimeslot?: DisplayTimeslot
  private service: TimeslotService
  private events: CalDisplayTimeslot[]

  constructor(
    eventsCopy: Map<number, DisplayTimeslot>,
    movedTimeslot: CalDisplayTimeslot,
    events: CalDisplayTimeslot[],
  ) {
    this.eventsCopy = eventsCopy
    this.service = new TimeslotService()
    this.newTimeslot = movedTimeslot
    this.events = events
  }

  private generateUpdatePayload(
    timeslot: CalDisplayTimeslot | DisplayTimeslot,
  ): TimeslotPutRequest {
    return {
      id: this.newTimeslot.id,
      start: getISODateTimeString(timeslot.start),
      end: getISODateTimeString(timeslot.end),
    }
  }

  async up(_initial: boolean): Promise<void> {
    return this.service.put(this.generateUpdatePayload(this.newTimeslot)).then(() => {
      const oldTimeslot = this.eventsCopy.get(this.newTimeslot.id)
      if (!oldTimeslot) {
        return Promise.reject(new Error("No old event found during move event"))
      }
      this.oldTimeslot = oldTimeslot
      this.eventsCopy.set(this.newTimeslot.id, this.newTimeslot)
    })
  }

  async down(): Promise<void> {
    if (!this.oldTimeslot) {
      return Promise.reject(new Error("No old event found during move event"))
    }
    return this.service.put(this.generateUpdatePayload(this.oldTimeslot)).then(() => {
      this.eventsCopy.set(this.newTimeslot.id, this.oldTimeslot as DisplayTimeslot)
      const timeslot = this.events.find((e) => e.id == this.newTimeslot.id)!
      timeslot.end = this.oldTimeslot!.end
      timeslot.start = this.oldTimeslot!.start
    })
  }
}
