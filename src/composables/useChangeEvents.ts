import type { ChangeEvent } from "@/utils/changeEvent"
import { ref } from "vue"

export function useChangeEvents() {
  const changeEvents = ref<ChangeEvent[]>([])

  function addChangeEvent(event: ChangeEvent): Promise<void> {
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
