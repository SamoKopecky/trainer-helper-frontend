import { TimeslotService } from "@/services/timeslots"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot } from "@/types/vuecal"
import type { ChangeEvent } from "./base"
import { getISODateString } from "@/utils/date"
import type { CalTimeslot } from "@/types/calendar"

export class CalendarCreateEvent implements ChangeEvent {
  private timeslot: UnresolvedVueCalTimeslot
  private eventResolver: (event: UnresolvedCalTimeslot) => void
  private service: TimeslotService
  public resolvedTimeslot?: CalTimeslot

  constructor(
    timeslot: UnresolvedVueCalTimeslot,
    eventResolver: (event: UnresolvedCalTimeslot) => void,
  ) {
    this.timeslot = timeslot
    this.eventResolver = eventResolver
    this.service = new TimeslotService()
  }

  public async up() {
    this.service
      .post({
        // TODO: Adjust trainer ids and user ids, make colors based on user ids
        trainer_id: 1,
        start: getISODateString(this.timeslot.start),
        end: getISODateString(this.timeslot.end),
      })
      .then((res) => {
        const unresolved: UnresolvedCalTimeslot = {
          ...this.timeslot,
          title: res.id.toString(),
          content: `trainer id: ${res.trainer_id}`,
          timeslot_id: res.id,
        }
        this.eventResolver(unresolved)
        this.resolvedTimeslot = unresolved as CalTimeslot
      })
  }

  public down() {
    if (!this.resolvedTimeslot) {
      throw new Error("Missing timeslot id")
    }
    this.service.delete({ timeslot_id: this.resolvedTimeslot?.timeslot_id }).then(() => {
      this.resolvedTimeslot?.delete(3)
    })
  }
}
