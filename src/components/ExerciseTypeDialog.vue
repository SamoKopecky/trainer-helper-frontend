<script setup lang="ts">
import type { ExerciseType } from "@/types/other"
import { useDebounceFn } from "@vueuse/core"
import { ref } from "vue"
import { computed, type PropType } from "vue"

const { modelValue, exerciseType } = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  exerciseType: {
    type: Object as PropType<ExerciseType | null>,
    required: false,
    default: null,
  },
})
const note = ref<string | undefined>(exerciseType?.note)

const debouncedEmitUpdateNote = useDebounceFn((newNote: string) => {
  emit("update:note", newNote)
}, 1000)

const noteModel = computed({
  get() {
    return exerciseType?.note || ""
  },
  set(newNote: string) {
    note.value = newNote
    debouncedEmitUpdateNote(newNote)
  },
})

const emit = defineEmits(["update:modelValue", "update:note"])

function closeDialog() {
  emit("update:modelValue", false)
}

function confirmChanges() {
  emit("update:note", note.value)
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog">
    <v-card>
      <v-card-title>{{ exerciseType?.name }}</v-card-title>
      <v-divider />
      <v-card-text>
        <v-textarea
          label="Exercise Notes"
          variant="outlined"
          rows="4"
          auto-grow
          clearable
          v-model="noteModel"
          placeholder="Enter any notes for this exercise type..."
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Exit</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="confirmChanges">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
