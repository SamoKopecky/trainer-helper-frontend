import type { ChangeNotification, NotificationType } from "@/types/other"
import { randomStringId } from "@/utils/other"
import { ref } from "vue"
import { defineStore } from "pinia"

export const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref<Map<string, ChangeNotification>>(new Map())

  function addNotification(text: string, type: NotificationType) {
    const notificationId = randomStringId()
    notifications.value.set(notificationId, {
      text,
      type,
    })
    setTimeout(() => notifications.value.delete(notificationId), 2000)
  }

  return { notifications, addNotification }
})
