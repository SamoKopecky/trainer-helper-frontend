<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { ExerciseTypeService } from "@/services/exerciseType"
import { ExerciseTypeDuplicateService } from "@/services/exerciseTypeDuplicate"
import type { ExerciseType, ExerciseTypeTableRow } from "@/types/other"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import type { ComputedRef } from "vue"
import { computed } from "vue"
import { onMounted } from "vue"
import { ref } from "vue"
import ExerciseTypeDialog from "@/components/ExerciseTypeDialog.vue"
import { useExerciseTypeDialog } from "@/composables/useExerciseTypeDialog"

const exerciseTypeServise = new ExerciseTypeService()
const exerciseTypeDuplicateServise = new ExerciseTypeDuplicateService()
const keycloak = useKeycloak()
const { showDialog, selectedType } = useExerciseTypeDialog()

const headers = ref([
  {
    align: "start",
    key: "name",
    title: "Name",
  },
  { key: "has_media", title: "Has Media" },
  // TODO: do an icon, red if there is alink, grey if not
  { key: "media_type", title: "Media Type" },
  { key: "id", align: " d-none" },
])

const exerciseTypes = ref<ExerciseType[]>([])
const tableExerciseTypes: ComputedRef<ExerciseTypeTableRow[]> = computed(() => {
  return exerciseTypes.value.map((et) => {
    return {
      name: et.name,
      media_type: et.media_type ?? "-",
      has_media: et.media_type !== undefined ? "No" : "Yes",
      id: et.id,
    } as ExerciseTypeTableRow
  })
})

onMounted(() => {
  if (keycloak.subject) {
    exerciseTypeServise
      .get({ user_id: keycloak.subject })
      .then((res) => (exerciseTypes.value = res))
  }
})

function rowClick(row: { item: ExerciseType }) {
  showDialog.value = true
  selectedType.value = exerciseTypes.value.find((et) => et.id === row.item.id) as ExerciseType
}

function addNew() {
  console.log("new")
}

function confirm(newExerciseType: ExerciseType) {
  if (selectedType.value) {
    exerciseTypeServise
      .put({
        // TODO: Update only changed
        id: selectedType.value.id,
        note: newExerciseType.note,
        media_type: newExerciseType.media_type,
        media_address: newExerciseType.media_address,
      })
      .then(() => (selectedType.value = newExerciseType))
  }
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
    <v-btn @click="initExerciseTypes">Create default exercise types</v-btn>
  </DataTable>
  <ExerciseTypeDialog
    v-model="showDialog"
    :exercise-type="selectedType"
    @update:exercise-type="confirm"
  />
</template>
