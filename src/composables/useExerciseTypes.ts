import { ExerciseTypeService } from "@/services/exerciseType"
import type { ExerciseType } from "@/types/exerciseType"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { onMounted, ref } from "vue"

export function useExerciseTypes() {
  const exerciseTypeServise = new ExerciseTypeService()
  const exerciseTypes = ref<ExerciseType[]>([])
  const keycloak = useKeycloak()

  onMounted(() => {
    if (keycloak.subject) {
      exerciseTypeServise
        .get({ user_id: keycloak.subject })
        .then((res) => (exerciseTypes.value = res))
    }
  })
  return { exerciseTypes }
}
