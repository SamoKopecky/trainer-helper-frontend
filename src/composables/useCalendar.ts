import type { ChangeEvent } from "@/changeEvents/base"
import { CalendarCreateEvent } from "@/changeEvents/calendarCreate"
import { TimeslotService, type TimeslotGetRequest } from "@/services/timeslots"
import type { CalTimeslot, AppTimeslot } from "@/types/calendar"
import type { Timeslot } from "@/types/other"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot, VueCalRef } from "@/types/vuecal"
import { isoToLocal } from "@/utils/date"
import { onMounted, ref, type Ref } from "vue"

export function useCalendar(
  selectedEvent: Ref<CalTimeslot | null>,
  showDialog: Ref<boolean, boolean>,
  addChangeEvent: (event: ChangeEvent) => void,
) {
  const vueCalRef = ref<VueCalRef | null>()
  const events = ref<Array<CalTimeslot>>([])
  const timeslotService = new TimeslotService()
  const request: TimeslotGetRequest = {
    start_date: "2025-01-20T12:00:00",
    end_date: "2026-02-28T20:15:00",
  }

  function clickTimeslot(data: { e: Event; event: CalTimeslot }) {
    selectedEvent.value = data.event
    showDialog.value = true
  }

  function deleteTimeslot(event: CalTimeslot | null) {
    if (event) {
      timeslotService.delete({ timeslot_id: event.timeslot_id }).then(() => event.delete(3))
    }
    showDialog.value = false
  }

  function createTimeslot(data: {
    event: UnresolvedVueCalTimeslot
    resolve: (event: UnresolvedCalTimeslot) => void
  }) {
    addChangeEvent(new CalendarCreateEvent(data.event, data.resolve))
  }

  onMounted(() => {
    timeslotService.get(request).then((timeslots) => {
      timeslots.forEach((timeslot: Timeslot) => {
        if (!vueCalRef.value) {
          throw new Error("Invalid vueCalRef")
        }
        vueCalRef.value.view.createEvent({
          start: isoToLocal(timeslot.start.toString()),
          end: isoToLocal(timeslot.end.toString()),
          title: timeslot.id.toString(),
          content: `trainer id: ${timeslot.trainer_id}`,
          timeslot_id: timeslot.id,
        } as AppTimeslot)
      })
    })
  })

  return {
    events,
    vueCalRef,
    clickTimeslot,
    deleteTimeslot,
    createTimeslot,
  }
}
