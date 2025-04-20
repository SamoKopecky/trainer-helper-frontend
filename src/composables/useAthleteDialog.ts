import { UserService } from "@/services/user"
import type { NotificationType } from "@/types/other"
import type { User } from "@/types/user"
import type { Ref } from "vue"
import { ref } from "vue"

export function useAthleteDialog(
  addNotification: (text: string, type: NotificationType) => void,
  users: Ref<User[]>,
) {
  const userService = new UserService()
  const user = ref<User | undefined>()
  const showDialog = ref(false)

  function deleteUser(userId?: string) {
    if (userId)
      userService
        .delete({ id: userId })
        .then(() => addNotification("User deleted succsefully!", "success"))
        .catch((err) => addNotification(err, "error"))
        .finally(() => {
          showDialog.value = false
          // Remove removed user
          users.value = users.value.filter((u) => u.id !== userId)
        })
  }

  return { user, showDialog, deleteUser }
}
