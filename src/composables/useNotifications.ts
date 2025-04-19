import type { ChangeNotification, NotificationType } from "@/types/other"
import { ref } from "vue"

function randomId(): string {
  return (Math.random() + 1).toString(36).substring(2)
}

export function useNotifications() {
  const notifications = ref<Map<string, ChangeNotification>>(new Map())

  function addNotification(text: string, type: NotificationType) {
    const notificationId = randomId()
    notifications.value.set(notificationId, {
      text,
      type,
    })
    setTimeout(() => notifications.value.delete(notificationId), 2000)
  }

  return { notifications, addNotification }
}
