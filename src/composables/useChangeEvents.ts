import type { ChangeEvent } from "@/changeEvents/base"
import type { NotificationType } from "@/types/other"
import { watch } from "vue"
import { ref } from "vue"

export function useChangeEvents(addNotification: (text: string, type: NotificationType) => void) {
  const changeEvents = ref<ChangeEvent[]>([])
  const undoActive = ref(false)

  function addChangeEvent(event: ChangeEvent) {
    changeEvents.value.push(event)
    event.up().catch((error: Error) => {
      addNotification(error.message, "error")
    })
  }

  function popChangeEvent() {
    if (changeEvents.value.length !== 0) {
      changeEvents.value
        .pop()
        ?.down()
        .catch((error: Error) => {
          addNotification(error.message, "error")
        })
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
