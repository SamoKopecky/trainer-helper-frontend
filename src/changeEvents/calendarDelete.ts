import { TimeslotService } from "@/services/timeslots"
import type { ChangeEvent } from "./base"
import type { CalTimeslot } from "@/types/calendar"
import { getISODateString } from "@/utils/date"
import type { VueCalView } from "@/types/vuecal"
import { timeslotToAppTimeslot } from "@/utils/tranformators"

export class CalendarDeleteEvent implements ChangeEvent {
  private timeslot: CalTimeslot
  private calendarView: VueCalView
  private service: TimeslotService

  constructor(timeslot: CalTimeslot, calendarView: VueCalView) {
    this.timeslot = timeslot
    this.calendarView = calendarView
    this.service = new TimeslotService()
  }

  public async up() {
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
        this.calendarView.createEvent(timeslotToAppTimeslot(timeslot))
      })
  }
}
