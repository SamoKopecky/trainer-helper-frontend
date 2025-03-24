import type { ChangeEvent } from "@/changeEvents/base"
import { watch } from "vue"
import { ref } from "vue"

export function useChangeEvents() {
  const changeEvents = ref<ChangeEvent[]>([])
  const undoActive = ref(false)

  function addChangeEvent(event: ChangeEvent) {
    changeEvents.value.push(event)
    event.up()
  }

  function popChangeEvent() {
    if (changeEvents.value.length !== 0) {
      changeEvents.value.pop()?.down()
    }
  }

  watch(
    () => changeEvents.value.length,
    (newLength) => {
      undoActive.value = newLength !== 0
    },
  )

  return { addChangeEvent, popChangeEvent, undoActive }
}
