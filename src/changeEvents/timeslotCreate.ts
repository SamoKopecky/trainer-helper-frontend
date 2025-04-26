import { TimeslotService } from "@/services/timeslots"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot } from "@/types/vuecal"
import type { ChangeEvent } from "./base"
import { getISODateString } from "@/utils/date"
import type { AppTimeslot, CalTimeslot } from "@/types/calendar"
import { timeslotToAppTimeslot } from "@/utils/tranformators"

export class TimeslotCreateEvent implements ChangeEvent {
  private timeslot: UnresolvedVueCalTimeslot
  private eventResolver: (event: UnresolvedCalTimeslot) => void
  private service: TimeslotService
  private eventsCopy: Map<number, AppTimeslot>
  private events: CalTimeslot[]
  private createdTimeslot?: AppTimeslot
  private subjectId: string

  constructor(
    timeslot: UnresolvedVueCalTimeslot,
    eventResolver: (event: UnresolvedCalTimeslot) => void,
    eventsCopy: Map<number, AppTimeslot>,
    events: CalTimeslot[],
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
        start: getISODateString(this.timeslot.start),
        end: getISODateString(this.timeslot.end),
      })
      .then((res) => {
        const appTimeslot = timeslotToAppTimeslot(res)
        const unresolved: UnresolvedCalTimeslot = {
          ...appTimeslot,
          id: res.id,
        }
        // Add to calendar using vue cal API
        this.eventResolver(unresolved)
        this.createdTimeslot = appTimeslot
        this.eventsCopy.set(unresolved.id, unresolved as AppTimeslot)
      })
  }

  public async down() {
    if (!this.createdTimeslot) {
      return Promise.reject(new Error("Missing timeslot to delete"))
    }
    return this.service.delete({ id: this.createdTimeslot?.id }).then(() => {
      // Can't be undefined, see condition above
      const createdTimeslot = this.createdTimeslot as AppTimeslot
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
