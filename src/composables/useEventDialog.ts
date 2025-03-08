import { ref } from "vue"
import type { CalTimeslot } from "../types/calendar"

export function useEventDialog() {
  const showDialog = ref(false)
  const selectedEvent = ref<CalTimeslot | null>(null)

  return { showDialog, selectedEvent }
}
