import type { ChangeEvent } from "@/changeEvents/base"
import type { NotificationType } from "@/types/other"
import { watch } from "vue"
import { ref } from "vue"

class IndexPointer {
  private index: number

  constructor() {
    this.index = -1
  }

  public up() {
    this.index++
  }

  public down() {
    if (this.index >= 0) {
      this.index--
    }
  }

  public get() {
    return this.index
  }
}

export function useChangeEvents(addNotification: (text: string, type: NotificationType) => void) {
  const changeEvents = ref<ChangeEvent[]>([])
  const currentEventIndex = ref<IndexPointer>(new IndexPointer())
  const undoActive = ref(false)
  const redoActive = ref(false)

  function addChangeEvent(event: ChangeEvent) {
    currentEventIndex.value.up()
    changeEvents.value.splice(currentEventIndex.value.get(), 0, event)
    event.up(true).catch((error: Error) => {
      addNotification(error.message, "error")
    })
  }

  function undo() {
    if (changeEvents.value.length === 0 || currentEventIndex.value.get() < 0) return
    changeEvents.value[currentEventIndex.value.get()]?.down().catch((error: Error) => {
      addNotification(error.message, "error")
    })
    currentEventIndex.value.down()
  }

  function redo() {
    if (
      changeEvents.value.length === 0 ||
      currentEventIndex.value.get() === changeEvents.value.length - 1
    )
      return
    currentEventIndex.value.up()
    changeEvents.value[currentEventIndex.value.get()]?.up(false).catch((error: Error) => {
      addNotification(error.message, "error")
    })
  }

  watch(
    () => currentEventIndex.value.get(),
    (index) => {
      undoActive.value = index !== -1
      redoActive.value = index !== changeEvents.value.length - 1
    },
  )

  return { addChangeEvent, undo, redo, undoActive, redoActive }
}
