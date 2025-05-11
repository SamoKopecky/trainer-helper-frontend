import { UserService } from "@/services/user"
import type { User } from "@/types/user"
import { onMounted, ref } from "vue"

export function useUsers() {
  const users = ref<User[]>()
  const userService = new UserService()

  // TODO: Use pinia store
  onMounted(() => {
    userService.get().then((res) => (users.value = res))
  })

  function userDisplay(user: User): string {
    return user.nickname || user.name || user.email
  }

  return { users, userDisplay }
}
