import type { ChangeEvent } from "@/changeEvents/base"
import { TimeslotCreateEvent } from "@/changeEvents/timeslotCreate"
import { TimelostDeleteEvent } from "@/changeEvents/timeslotDelete"
import { TimeslotMoveEvent } from "@/changeEvents/timestlotMove"
import { TimeslotService, type TimeslotGetRequest } from "@/services/timeslots"
import type { AppTimeslot } from "@/types/calendar"
import type { CalTimeslot } from "@/types/calendar"
import type { Timeslot } from "@/types/other"
import type { User } from "@/types/user"
import type { UnresolvedCalTimeslot, UnresolvedVueCalTimeslot, VueCalRef } from "@/types/vuecal"
import { timeslotToAppTimeslot } from "@/utils/tranformators"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { onMounted, ref, type Ref } from "vue"

export function useCalendar(
  selectedEvent: Ref<CalTimeslot | null>,
  showDialog: Ref<boolean, boolean>,
  addChangeEvent: (event: ChangeEvent) => void,
) {
  const keycloack = useKeycloak()
  const vueCalRef = ref<VueCalRef | null>()
  const events = ref<Array<CalTimeslot>>([])
  const oldEvents: Map<number, AppTimeslot> = new Map()
  const timeslotService = new TimeslotService()
  const request: TimeslotGetRequest = {
    start_date: "2025-01-20T12:00:00Z",
    end_date: "2026-02-28T20:15:00Z",
  }

  function clickTimeslot(data: { e: Event; event: CalTimeslot }) {
    selectedEvent.value = data.event
    showDialog.value = true
  }

  function deleteTimeslot(event: CalTimeslot | null) {
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

  function updateEventUser(user: User | undefined) {
    if (selectedEvent.value && user) {
      selectedEvent.value.title = user.nickname ?? user.name
      selectedEvent.value.class = "assigned"
      timeslotService
        .put({ id: selectedEvent.value.id, trainee_id: user.id })
        .then(() => (selectedEvent.value!.trainee_id = user.id))
    }
  }

  function eventMove(data: { e: Event; event: CalTimeslot; cell: unknown }) {
    addChangeEvent(new TimeslotMoveEvent(oldEvents, data.event, events.value))
  }

  onMounted(() => {
    timeslotService.get(request).then((timeslots) => {
      timeslots.forEach((timeslot: Timeslot) => {
        if (!vueCalRef.value) {
          throw new Error("Invalid vueCalRef")
        }
        const appTimeslot = timeslotToAppTimeslot(timeslot)
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
    updateEventUser,
    eventMove,
  }
}
