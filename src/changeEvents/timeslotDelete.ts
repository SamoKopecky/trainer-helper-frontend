import { TimeslotService } from "@/services/timeslots"
import type { ChangeEvent } from "./base"
import type { AppTimeslot, CalTimeslot } from "@/types/calendar"
import { getISODateString } from "@/utils/date"
import type { VueCalView } from "@/types/vuecal"
import { timeslotToAppTimeslot } from "@/utils/tranformators"

export class TimelostDeleteEvent implements ChangeEvent {
  private timeslot: CalTimeslot
  private calendarView: VueCalView
  private service: TimeslotService
  private eventsCopy: Map<number, AppTimeslot>

  constructor(
    timeslot: CalTimeslot,
    calendarView: VueCalView,
    eventsCopy: Map<number, AppTimeslot>,
  ) {
    this.timeslot = timeslot
    this.calendarView = calendarView
    this.service = new TimeslotService()
    this.eventsCopy = eventsCopy
  }

  public async up() {
    this.eventsCopy.delete(this.timeslot.id)
    this.service.delete({ timeslot_id: this.timeslot.id }).then(() => this.timeslot.delete(3))
  }

  public down() {
    this.service
      .post({
        trainer_id: 1,
        start: getISODateString(this.timeslot.start),
        end: getISODateString(this.timeslot.end),
      })
      .then((timeslot) => {
        const appTimeslot = timeslotToAppTimeslot(timeslot)
        this.eventsCopy.set(appTimeslot.id, appTimeslot)
        this.calendarView.createEvent(appTimeslot)
      })
  }
}
