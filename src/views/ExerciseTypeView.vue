<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { ExerciseTypeDuplicateService } from "@/services/exerciseTypeDuplicate"
import { type ExerciseType, type ExerciseTypeTableRow, MediaType } from "@/types/other"
import type { ComputedRef } from "vue"
import { computed } from "vue"
import { ref } from "vue"
import ExerciseTypeDialog from "@/components/ExerciseTypeDialog.vue"
import { useExerciseTypeDialog } from "@/composables/useExerciseTypeDialog"
import { exerciseTypeToRow } from "@/utils/tranformators"
import { useExerciseTypes } from "@/composables/useExerciseTypes"

// Refs
const headers = ref([
  {
    align: "start",
    key: "name",
    title: "Name",
  },
  { key: "hasMedia", title: "Has Media", align: " d-none" },
  { key: "hasMediaVal", title: "Has Media" },
  { key: "mediaType", title: "Media Type" },
  { key: "id", align: " d-none" },
])
const exerciseTypeDuplicateServise = new ExerciseTypeDuplicateService()
const { exerciseTypes } = useExerciseTypes()
const tableExerciseTypes: ComputedRef<ExerciseTypeTableRow[]> = computed(() =>
  exerciseTypes.value.map((et) => exerciseTypeToRow(et)),
)
const { showDialog, selectedType, isNew, handleUpdate, handleCreate, addNew } =
  useExerciseTypeDialog(exerciseTypes)

// Functions
function rowClick(row: { item: ExerciseType }) {
  isNew.value = false
  showDialog.value = true
  selectedType.value = exerciseTypes.value.find((et) => et.id === row.item.id) as ExerciseType
}

function initExerciseTypes() {
  exerciseTypeDuplicateServise
    .post()
    .then((res) => (exerciseTypes.value = exerciseTypes.value.concat(res)))
}
</script>

<template>
  <DataTable
    :headers="headers"
    :items="tableExerciseTypes"
    title="Exercise types"
    @row-click="rowClick"
    @add-new="addNew"
  >
    <template #extra>
      <v-btn @click="initExerciseTypes">Create default exercise types</v-btn>
    </template>
    <!-- eslint-disable-next-line  -->
    <template v-slot:item.mediaType="{ item }">
      <v-icon v-if="item.mediaType === MediaType.Youtube" :color="item.hasMedia ? 'red' : 'grey'"
        >mdi-youtube</v-icon
      >
      <v-icon
        v-else-if="item.mediaType === MediaType.File"
        :color="item.hasMedia ? 'white' : 'grey'"
        >mdi-link</v-icon
      >
    </template>
  </DataTable>

  <ExerciseTypeDialog
    v-model="showDialog"
    :exercise-type="selectedType"
    :is-new="isNew"
    @update:exercise-type="handleUpdate"
    @create:exercise-type="handleCreate"
  />
</template>
