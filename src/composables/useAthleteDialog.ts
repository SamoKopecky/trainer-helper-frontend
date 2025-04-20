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

  function deleteUser() {
    if (user.value)
      userService
        .delete({ id: user.value?.id })
        .then(() => addNotification("User deleted succsefully!", "success"))
        .catch((err) => addNotification(err, "error"))
        .finally(() => {
          showDialog.value = false
          // Remove removed user
          users.value = users.value.filter((u) => u.id !== user.value!.id)
        })
  }

  function updateNickname(nickname: string) {
    if (user.value)
      userService
        .put({ nickname: nickname, id: user.value.id })
        .then(() => (user.value!.nickname = nickname))
        .catch((err) => addNotification(err, "error"))
  }

  return { user, showDialog, deleteUser, updateNickname }
}
