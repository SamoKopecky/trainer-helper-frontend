import {
  ExerciseTypeService,
  type ExerciseTypePostRequest,
  type ExerciseTypePutRequest,
} from "@/services/exerciseType"
import { type ExerciseType, type ExerciseTypeUpdate } from "@/types/exerciseType"
import { ref, type Ref } from "vue"

export function useExerciseTypeDialog(exerciseTypes: Ref<ExerciseType[]>) {
  const showDialog = ref(false)
  const isNew = ref(false)
  const selectedType = ref<ExerciseType | undefined>()
  const exerciseTypeServise = new ExerciseTypeService()

  function handleCreate(newExerciseTypeRequest: ExerciseTypePostRequest) {
    exerciseTypeServise.post(newExerciseTypeRequest).then((res) => {
      isNew.value = false
      selectedType.value = res
      exerciseTypes.value.push(res)
    })
  }

  function handleUpdate(updateData: ExerciseTypeUpdate) {
    if (selectedType.value) {
      const request: ExerciseTypePutRequest = {
        id: selectedType.value.id,
        ...updateData,
      }
      exerciseTypeServise.put(request).then(() => {
        if (selectedType.value) {
          exerciseTypes.value
            .filter((et) => et.id === selectedType.value?.id)
            .forEach((et) => {
              et.note = updateData.note
              et.media_type = updateData.media_type
              et.media_address = updateData.media_address
            })
        }
      })
    }
  }

  function addNew() {
    isNew.value = true
    selectedType.value = undefined
    showDialog.value = true
  }

  return { showDialog, selectedType, handleCreate, handleUpdate, isNew, addNew }
}
