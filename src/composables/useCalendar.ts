import type { ChangeEvent } from "@/changeEvents/base"
import { TimeslotCreateEvent } from "@/changeEvents/timeslotCreate"
import { TimelostDeleteEvent } from "@/changeEvents/timeslotDelete"
import { TimeslotMoveEvent } from "@/changeEvents/timestlotMove"
import { TimeslotService, type TimeslotDetailedGetRequest } from "@/services/timeslots"
import type { DisplayTimeslot } from "@/types/calendar"
import type { CalDisplayTimeslot } from "@/types/calendar"
import type { EnhancedTimeslot } from "@/types/other"
import type { User } from "@/types/user"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot, VueCalRef } from "@/types/vuecal"
import { timeslotToDisplayTimeslot } from "@/utils/tranformators"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { onMounted, ref, type Ref } from "vue"

export function useCalendar(
  selectedEvent: Ref<CalDisplayTimeslot | undefined>,
  showDialog: Ref<boolean, boolean>,
  addChangeEvent: (event: ChangeEvent) => void,
) {
  const keycloack = useKeycloak()
  const vueCalRef = ref<VueCalRef | null>()
  const events = ref<CalDisplayTimeslot[]>([])
  const oldEvents: Map<number, DisplayTimeslot> = new Map()
  const timeslotService = new TimeslotService()
  const request: TimeslotDetailedGetRequest = {
    start: "2025-01-20T12:00:00Z",
    end: "2026-02-28T20:15:00Z",
  }

  function clickTimeslot(data: { e: Event; event: CalDisplayTimeslot }) {
    selectedEvent.value = data.event
    showDialog.value = true
  }

  function deleteTimeslot(event: CalDisplayTimeslot | null) {
    if (event && vueCalRef.value) {
      addChangeEvent(new TimelostDeleteEvent(event, vueCalRef.value.view, oldEvents))
    }
    showDialog.value = false
  }

  function createTimeslot(data: {
    event: UnresolvedVueCalTimeslot
    resolve: (event: UnresolvedCalTimeslot) => void
  }) {
    addChangeEvent(
      new TimeslotCreateEvent(
        data.event,
        data.resolve,
        oldEvents,
        events.value,
        keycloack.tokenParsed?.sub as string,
      ),
    )
  }

  function eventMove(data: { e: Event; event: CalDisplayTimeslot; cell: unknown }) {
    addChangeEvent(new TimeslotMoveEvent(oldEvents, data.event, events.value))
  }

  onMounted(() => {
    timeslotService.getDetailed(request).then((timeslots) => {
      timeslots.forEach((timeslot: EnhancedTimeslot) => {
        if (!vueCalRef.value) return
        const appTimeslot = timeslotToDisplayTimeslot(timeslot)
        vueCalRef.value.view.createEvent(appTimeslot)
        oldEvents.set(timeslot.id, appTimeslot)
      })
    })
  })

  return {
    events,
    vueCalRef,
    clickTimeslot,
    deleteTimeslot,
    createTimeslot,
    eventMove,
  }
}
