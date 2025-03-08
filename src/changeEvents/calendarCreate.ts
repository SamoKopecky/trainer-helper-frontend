import { TimeslotService } from "@/services/timeslots"
import type { UnresolvedVueCalTimeslot, VueCalTimeslot } from "@/types/vuecal"
import type { ChangeEvent } from "./base"
import { getISODateString } from "@/utils/date"

export class CalendarCreateEvent implements ChangeEvent {
  private timeslot: UnresolvedVueCalTimeslot
  private service: TimeslotService
  public resolvedTimeslot?: VueCalTimeslot
  private timeslotId?: number

  constructor(timeslot: UnresolvedVueCalTimeslot) {
    this.timeslot = timeslot
    this.service = new TimeslotService()
  }

  public async up<Timeslot>(): Promise<Timeslot> {
    console.log(getISODateString(this.timeslot.start))
    console.log(this.timeslot.start)
    return this.service
      .post({
        trainer_id: 1,
        start: getISODateString(this.timeslot.start),
        end: getISODateString(this.timeslot.end),
      })
      .then((res) => {
        this.timeslotId = res.id
        return res
      }) as Promise<Timeslot>
  }

  public down(): void {
    if (!this.timeslotId || !this.resolvedTimeslot) {
      throw new Error("Missing timeslot id")
    }
    this.service.delete({ timeslot_id: this.timeslotId }).then(() => {
      this.resolvedTimeslot?.delete(3)
    })
  }
}
