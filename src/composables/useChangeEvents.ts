import type { ChangeEvent } from "@/changeEvents/base"
import { ref } from "vue"

export function useChangeEvents() {
  const changeEvents = ref<ChangeEvent[]>([])

  function addChangeEvent(event: ChangeEvent) {
    changeEvents.value.push(event)
    return event.up()
  }

  function popChangeEvent() {
    if (changeEvents.value.length !== 0) {
      changeEvents.value.pop()?.down()
    }
  }

  return { addChangeEvent, popChangeEvent }
}
