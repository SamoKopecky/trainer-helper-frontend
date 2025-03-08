import type { ChangeEvent } from "@/utils/changeEvent"
import { ref } from "vue"

export function useChangeEvents() {
  const changeEvents = ref<ChangeEvent[]>([])

  function addChangeEvent<T>(event: ChangeEvent): Promise<T> {
    changeEvents.value.push(event)
    return event.up<T>()
  }

  function popChangeEvent() {
    if (changeEvents.value.length !== 0) {
      changeEvents.value.pop()?.down()
    }
  }

  return { addChangeEvent, popChangeEvent }
}
