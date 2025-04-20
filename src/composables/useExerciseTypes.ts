import { ExerciseTypeService } from "@/services/exerciseType"
import type { ExerciseType } from "@/types/exerciseType"
import { onMounted, ref, type Ref } from "vue"
import { useUser } from "./useUser"

export function useExerciseTypes(loading?: Ref<boolean>) {
  const exerciseTypeServise = new ExerciseTypeService()
  const exerciseTypes = ref<ExerciseType[]>([])
  const { trainerId } = useUser()

  onMounted(() => {
    if (loading) loading.value = true
    if (trainerId.value) {
      exerciseTypeServise.get({ user_id: trainerId.value }).then((res) => {
        exerciseTypes.value = res
        if (loading) loading.value = false
      })
    }
  })
  return { exerciseTypes }
}
