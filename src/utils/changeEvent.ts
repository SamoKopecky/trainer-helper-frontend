import { TimeslotService } from "@/services/timeslots"
import type { UnresolvedVueCalTimeslot, VueCalTimeslot } from "@/types"

export interface ChangeEvent {
  up<T>(): Promise<T>
  down(): void
}

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
    return this.service
      .post({
        trainer_id: 1,
        start: this.timeslot.start.toISOString().split(".")[0],
        duration: 60,
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
