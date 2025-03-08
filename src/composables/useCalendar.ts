import type { ChangeEvent } from "@/changeEvents/base"
import { CalendarCreateEvent } from "@/changeEvents/calendarCreate"
import { TimeslotService, type TimeslotGetRequest } from "@/services/timeslots"
import type { CalTimeslot, AppTimeslot } from "@/types/calendar"
import type { Timeslot } from "@/types/other"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot, VueCalRef } from "@/types/vuecal"
import { onMounted, ref, type Ref } from "vue"

function addMinutes(date: Date, minutes: number): Date {
  const msToAdd = minutes * 60 * 1000
  return new Date(date.getTime() + msToAdd)
}

export function useCalendar(
  selectedEvent: Ref<CalTimeslot | null>,
  showDialog: Ref<boolean, boolean>,
  addChangeEvent: <T>(event: ChangeEvent) => Promise<T>,
) {
  const vueCalRef = ref<VueCalRef | null>()
  const events = ref<Array<CalTimeslot>>([])
  const timeslotService = new TimeslotService()
  const request: TimeslotGetRequest = {
    start_date: "2025-01-20T12:00:00",
    end_date: "2026-02-28T20:15:00",
  }

  function onCalTimeslotClick(data: { e: Event; event: CalTimeslot }) {
    selectedEvent.value = data.event
    showDialog.value = true
  }

  function deleteCalTimeslot(event: CalTimeslot | null) {
    if (event) {
      timeslotService.delete({ timeslot_id: event.timeslot_id }).then(() => event.delete(3))
    }
    showDialog.value = false
  }

  function createCalTimeslot(data: {
    event: UnresolvedVueCalTimeslot
    resolve: (event: UnresolvedCalTimeslot) => void
  }) {
    const changeEvent = new CalendarCreateEvent(data.event)
    addChangeEvent<Timeslot>(changeEvent).then((res) => {
      const unresolved: UnresolvedCalTimeslot = {
        ...data.event,
        title: res.id.toString(),
        content: `trainer id: ${res.trainer_id}`,
        timeslot_id: res.id,
      }
      data.resolve(unresolved)
      changeEvent.resolvedTimeslot = unresolved as CalTimeslot
    })
  }

  onMounted(() => {
    timeslotService.get(request).then((timeslots) => {
      timeslots.forEach((timeslot: Timeslot) => {
        if (!vueCalRef.value) {
          throw new Error("Invalid vueCalRef")
        }
        vueCalRef.value.view.createEvent({
          start: new Date(timeslot.start.toString()),
          end: new Date(addMinutes(timeslot.start, timeslot.duration).toString()),
          title: timeslot.id.toString(),
          content: `trainer id: ${timeslot.trainer_id}`,
          timeslot_id: timeslot.id,
        } as AppTimeslot)
      })
    })
  })

  return { events, vueCalRef, onCalTimeslotClick, deleteCalTimeslot, createCalTimeslot }
}
