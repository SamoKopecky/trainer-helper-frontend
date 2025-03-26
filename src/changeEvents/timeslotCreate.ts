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

  public up() {
    this.service
      .post({
        // TODO: Adjust trainer ids and user ids, make colors based on user ids
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

  public down() {
    if (!this.createdTimeslot) {
      throw new Error("Missing timeslot to delete")
    }
    this.service.delete({ id: this.createdTimeslot?.id }).then(() => {
      // Can't be undefined, see condition above
      const createdTimeslot = this.createdTimeslot as AppTimeslot
      const createdTimeslotEvent = this.events.find((e) => e.id === createdTimeslot.id)
      if (!createdTimeslotEvent) {
        throw new Error("Missing timeslot to delete")
      }
      // 3 -- Delete completly
      createdTimeslotEvent.delete(3)
      this.eventsCopy.delete(createdTimeslot.id)
    })
  }
}
