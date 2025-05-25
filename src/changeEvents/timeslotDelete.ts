import { TimeslotService } from "@/services/timeslots"
import type { ChangeEvent } from "./base"
import type { DisplayTimeslot, CalDisplayTimeslot } from "@/types/calendar"
import type { VueCalView } from "@/types/vuecal"

export class TimelostDeleteEvent implements ChangeEvent {
  private timeslot: CalDisplayTimeslot
  private calendarView: VueCalView
  private timeslotService: TimeslotService
  private eventsCopy: Map<number, DisplayTimeslot>

  constructor(
    timeslot: CalDisplayTimeslot,
    calendarView: VueCalView,
    eventsCopy: Map<number, DisplayTimeslot>,
  ) {
    this.timeslot = timeslot
    this.calendarView = calendarView
    this.timeslotService = new TimeslotService()
    this.eventsCopy = eventsCopy
  }

  public async up(_initial: boolean) {
    return this.timeslotService.delete(this.timeslot.id).then(() => {
      this.eventsCopy.delete(this.timeslot.id)
      this.timeslot.delete(3)
    })
  }

  public async down() {
    return this.timeslotService.postUndelete(this.timeslot.id).then(() => {
      this.eventsCopy.set(this.timeslot.id, this.timeslot)
      this.calendarView.createEvent(this.timeslot)
    })
  }
}
