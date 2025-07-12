<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { type ExerciseType, type ExerciseTypeTableRow } from "@/types/exerciseType"
import type { ComputedRef } from "vue"
import { computed } from "vue"
import { ref } from "vue"
import ExerciseTypeDialog from "@/components/ExerciseTypeDialog.vue"
import { useExerciseTypeDialog } from "@/composables/useExerciseTypeDialog"
import { exerciseTypeToRow } from "@/utils/tranformators"
import { useExerciseTypes } from "@/composables/useExerciseTypes"
import { ExerciseTypeService } from "@/services/exerciseType"

// Refs
const headers = ref([
  {
    align: "start",
    key: "name",
    title: "Name",
  },
  { key: "hasMedia", title: "Has Media" },
  { key: "hasYoutube", title: "Has Youtube" },

  { key: "id", align: " d-none" },
])
const exerciseTypeService = new ExerciseTypeService()
const loading = ref(false)
const { exerciseTypes } = useExerciseTypes(loading)
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
  exerciseTypeService
    .postDuplicate()
    .then((res) => (exerciseTypes.value = exerciseTypes.value.concat(res)))
}
</script>

<template>
  <DataTable
    :headers="headers"
    :items="tableExerciseTypes"
    :loading="loading"
    title="Exercise Types"
    @row-click="rowClick"
    @add-new="addNew"
  >
    <template #extra>
      <v-btn @click="initExerciseTypes">Create default exercise types</v-btn>
    </template>
    <!-- HINT: item.COLUMN_NAME -->
    <!-- eslint-disable-next-line  -->
    <template v-slot:item.hasYoutube="{ item }">
      <v-icon :color="item.hasYoutube ? 'red' : 'grey'">mdi-youtube</v-icon>
    </template>
    <!-- eslint-disable-next-line  -->
    <template v-slot:item.hasMedia="{ item }">
      <v-icon :color="item.hasMedia ? 'green' : 'grey'">mdi-link</v-icon>
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
