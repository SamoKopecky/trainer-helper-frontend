import { ExerciseTypeService } from "@/services/exerciseType"
import type { ExerciseType } from "@/types/exerciseType"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { onMounted, ref, type Ref } from "vue"

export function useExerciseTypes(loading?: Ref<boolean>) {
  const exerciseTypeServise = new ExerciseTypeService()
  const exerciseTypes = ref<ExerciseType[]>([])
  const keycloak = useKeycloak()

  onMounted(() => {
    if (loading) loading.value = true
    if (keycloak.subject) {
      exerciseTypeServise.get({ user_id: keycloak.subject }).then((res) => {
        exerciseTypes.value = res
        if (loading) loading.value = false
      })
    }
  })
  return { exerciseTypes }
}
