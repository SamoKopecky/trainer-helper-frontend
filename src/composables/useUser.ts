import { getTrainerIdAttribute, isUserTrainer } from "@/utils/user"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { computed } from "vue"

export function useUser() {
  const keycloak = useKeycloak()
  const isTrainer = computed(() => isUserTrainer(keycloak.tokenParsed))
  const trainerId = computed(() => {
    if (isTrainer.value) {
      return keycloak.subject
    } else {
      return getTrainerIdAttribute(keycloak.tokenParsed)
    }
  })

  return { isTrainer, trainerId }
}
