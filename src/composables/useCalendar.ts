import type { ChangeEvent } from "@/changeEvents/base"
import { CalendarCreateEvent } from "@/changeEvents/calendarCreate"
import { CalendarDeleteEvent } from "@/changeEvents/calendarDelete"
import { TimeslotService, type TimeslotGetRequest } from "@/services/timeslots"
import type { CalTimeslot } from "@/types/calendar"
import type { Person, Timeslot } from "@/types/other"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot, VueCalRef } from "@/types/vuecal"
import { timeslotToAppTimeslot } from "@/utils/tranformators"
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
    if (event && vueCalRef.value) {
      addChangeEvent(new CalendarDeleteEvent(event, vueCalRef.value.view))
    }
    showDialog.value = false
  }

  function createTimeslot(data: {
    event: UnresolvedVueCalTimeslot
    resolve: (event: UnresolvedCalTimeslot) => void
  }) {
    addChangeEvent(new CalendarCreateEvent(data.event, data.resolve))
  }

  function updateEventPerson(person: Person | undefined) {
    if (selectedEvent.value && person) {
      selectedEvent.value.title = person.name
      selectedEvent.value.class = "assigned"
      timeslotService.put({ id: selectedEvent.value.id, user_id: person.id })
    }
  }

  onMounted(() => {
    timeslotService.get(request).then((timeslots) => {
      timeslots.forEach((timeslot: Timeslot) => {
        if (!vueCalRef.value) {
          throw new Error("Invalid vueCalRef")
        }
        vueCalRef.value.view.createEvent(timeslotToAppTimeslot(timeslot))
      })
    })
  })

  return {
    events,
    vueCalRef,
    clickTimeslot,
    deleteTimeslot,
    createTimeslot,
    updateEventPerson,
  }
}
