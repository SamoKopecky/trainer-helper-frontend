import type { ChangeEvent } from "@/changeEvents/base"
import type { NotificationType } from "@/types/other"
import { watch } from "vue"
import { ref } from "vue"

class IndexPointer {
  private _index: number = -1

  public up(): void {
    this._index++
  }

  public down(): void {
    if (this._index >= 0) this._index--
  }

  public get index(): number {
    return this._index
  }
}

export function useChangeEvents(addNotification: (text: string, type: NotificationType) => void) {
  const changeEvents = ref<ChangeEvent[]>([])
  const currentEventPointer = ref<IndexPointer>(new IndexPointer())
  const undoActive = ref(false)
  const redoActive = ref(false)

  function addChangeEvent(event: ChangeEvent) {
    currentEventPointer.value.up()
    changeEvents.value.splice(currentEventPointer.value.index, 0, event)
    event.up(true).catch((error: Error) => {
      console.log(error)
      addNotification(error.message, "error")
    })
  }

  function undo() {
    if (changeEvents.value.length === 0 || currentEventPointer.value.index < 0) return
    changeEvents.value[currentEventPointer.value.index]?.down().catch((error: Error) => {
      console.log(error)
      addNotification(error.message, "error")
    })
    currentEventPointer.value.down()
  }

  function redo() {
    if (
      changeEvents.value.length === 0 ||
      currentEventPointer.value.index === changeEvents.value.length - 1
    )
      return
    currentEventPointer.value.up()
    changeEvents.value[currentEventPointer.value.index]?.up(false).catch((error: Error) => {
      console.log(error)
      addNotification(error.message, "error")
    })
  }

  watch(
    () => currentEventPointer.value.index,
    (index) => {
      undoActive.value = index !== -1
      redoActive.value = index !== changeEvents.value.length - 1
    },
  )

  return { addChangeEvent, undo, redo, undoActive, redoActive }
}
