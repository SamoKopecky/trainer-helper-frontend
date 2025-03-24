import { TimeslotService } from "@/services/timeslots"
import { TimeslotRevertService } from "@/services/timeslotRevert"
import type { ChangeEvent } from "./base"
import type { AppTimeslot, CalTimeslot } from "@/types/calendar"
import type { VueCalView } from "@/types/vuecal"

export class TimelostDeleteEvent implements ChangeEvent {
  private timeslot: CalTimeslot
  private calendarView: VueCalView
  private timeslotService: TimeslotService
  private timeslotRevertService: TimeslotRevertService
  private eventsCopy: Map<number, AppTimeslot>

  constructor(
    timeslot: CalTimeslot,
    calendarView: VueCalView,
    eventsCopy: Map<number, AppTimeslot>,
  ) {
    this.timeslot = timeslot
    this.calendarView = calendarView
    this.timeslotService = new TimeslotService()
    this.timeslotRevertService = new TimeslotRevertService()
    this.eventsCopy = eventsCopy
  }

  public async up() {
    this.timeslotService.delete({ id: this.timeslot.id }).then(() => {
      this.eventsCopy.delete(this.timeslot.id)
      this.timeslot.delete(3)
    })
  }

  public down() {
    this.timeslotRevertService
      .put({
        id: this.timeslot.id,
      })
      .then(() => {
        this.eventsCopy.set(this.timeslot.id, this.timeslot)
        this.calendarView.createEvent(this.timeslot)
      })
  }
}
