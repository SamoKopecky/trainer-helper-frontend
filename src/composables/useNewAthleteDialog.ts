import { ref, type Ref } from "vue"
import type { User } from "@/types/user"
import { getUserFromEmail } from "@/utils/user"
import { UserService } from "@/services/user"
import type { NotificationType } from "@/types/other"

export function useNewAthleteDialog(
  addNotification: (text: string, type: NotificationType) => void,
  users: Ref<User[]>,
) {
  const userService = new UserService()
  const isLoading = ref(false)
  const showDialog = ref(false)

  function sendEmail(email: string) {
    // TODO: Fix this nonsense
    if (email && getUserFromEmail(email)) {
      isLoading.value = true
      userService
        .post({ email: email, username: getUserFromEmail(email)! })
        .then((res) => {
          const newUser: User = { id: res.user_id, email: email, nickname: "", name: "" }
          users.value.push(newUser)
          addNotification("User added succsefully!", "success")
        })
        .catch((err) => {
          addNotification(err, "error")
        })
        .finally(() => (isLoading.value = false))
    }
  }

  return { isLoading, showDialog, sendEmail }
}
