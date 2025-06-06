import { TimeslotService } from "@/services/timeslots"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot } from "@/types/vuecal"
import type { ChangeEvent } from "./base"
import { getISODateTimeString } from "@/utils/date"
import type { DisplayTimeslot, CalDisplayTimeslot } from "@/types/calendar"
import { timeslotToDisplayTimeslot } from "@/utils/tranformators"

export class TimeslotCreateEvent implements ChangeEvent {
  private timeslot: UnresolvedVueCalTimeslot
  private eventResolver: (event: UnresolvedCalTimeslot) => void
  private service: TimeslotService
  private eventsCopy: Map<number, DisplayTimeslot>
  private events: CalDisplayTimeslot[]
  private createdTimeslot?: DisplayTimeslot
  private subjectId: string

  constructor(
    timeslot: UnresolvedVueCalTimeslot,
    eventResolver: (event: UnresolvedCalTimeslot) => void,
    eventsCopy: Map<number, DisplayTimeslot>,
    events: CalDisplayTimeslot[],
    subjectId: string,
  ) {
    this.timeslot = timeslot
    this.eventResolver = eventResolver
    this.service = new TimeslotService()
    this.events = events
    this.eventsCopy = eventsCopy
    this.subjectId = subjectId
  }

  public async up(_initial: boolean) {
    return this.service
      .post({
        trainer_id: this.subjectId,
        start: getISODateTimeString(this.timeslot.start),
        end: getISODateTimeString(this.timeslot.end),
      })
      .then((res) => {
        const appTimeslot = timeslotToDisplayTimeslot(res)
        const unresolved: UnresolvedCalTimeslot = {
          ...appTimeslot,
          id: res.id,
        }
        // Add to calendar using vue cal API
        this.eventResolver(unresolved)
        this.createdTimeslot = appTimeslot
        this.eventsCopy.set(unresolved.id, unresolved as DisplayTimeslot)
      })
  }

  public async down() {
    if (!this.createdTimeslot) {
      return Promise.reject(new Error("Missing timeslot to delete"))
    }
    return this.service.delete(this.createdTimeslot?.id).then(() => {
      // Can't be undefined, see condition above
      const createdTimeslot = this.createdTimeslot as DisplayTimeslot
      const createdTimeslotEvent = this.events.find((e) => e.id === createdTimeslot.id)
      if (!createdTimeslotEvent) {
        return Promise.reject(new Error("Missing timeslot to delete"))
      }
      // 3 -- Delete completly
      createdTimeslotEvent.delete(3)
      this.eventsCopy.delete(createdTimeslot.id)
    })
  }
}
