import { TimeslotService } from "@/services/timeslots"
import type { ChangeEvent } from "./base"
import type { AppTimeslot, CalTimeslot } from "@/types/calendar"
import type { VueCalView } from "@/types/vuecal"

export class TimelostDeleteEvent implements ChangeEvent {
  private timeslot: CalTimeslot
  private calendarView: VueCalView
  private timeslotService: TimeslotService
  private eventsCopy: Map<number, AppTimeslot>

  constructor(
    timeslot: CalTimeslot,
    calendarView: VueCalView,
    eventsCopy: Map<number, AppTimeslot>,
  ) {
    this.timeslot = timeslot
    this.calendarView = calendarView
    this.timeslotService = new TimeslotService()
    this.eventsCopy = eventsCopy
  }

  public async up(_initial: boolean) {
    return this.timeslotService.delete({ id: this.timeslot.id }).then(() => {
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
