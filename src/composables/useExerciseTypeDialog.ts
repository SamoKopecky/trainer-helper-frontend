import { ref } from "vue"
import type { ExerciseType } from "@/types/other"

export function useExerciseTypeDialog() {
  const showDialog = ref(false)
  const selectedType = ref<ExerciseType | null>(null)

  return { showDialog, selectedType }
}
