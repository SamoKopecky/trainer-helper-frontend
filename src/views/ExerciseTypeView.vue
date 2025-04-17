<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import {
  ExerciseTypeService,
  type ExerciseTypePostRequest,
  type ExerciseTypePutRequest,
} from "@/services/exerciseType"
import { ExerciseTypeDuplicateService } from "@/services/exerciseTypeDuplicate"
import {
  type ExerciseType,
  type ExerciseTypeTableRow,
  type ExerciseTypeUpdate,
  MediaType,
} from "@/types/other"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import type { ComputedRef } from "vue"
import { computed } from "vue"
import { onMounted } from "vue"
import { ref } from "vue"
import ExerciseTypeDialog from "@/components/ExerciseTypeDialog.vue"
import { useExerciseTypeDialog } from "@/composables/useExerciseTypeDialog"
import { exerciseTypeToRow } from "@/utils/tranformators"

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
  { key: "hasMedia", title: "Has Media", align: " d-none" },
  { key: "hasMediaVal", title: "Has Media" },
  { key: "mediaType", title: "Media Type" },
  { key: "id", align: " d-none" },
])

const exerciseTypes = ref<ExerciseType[]>([])
const isNew = ref(false)
const tableExerciseTypesRef: ComputedRef<ExerciseTypeTableRow[]> = computed(() =>
  exerciseTypes.value.map((et) => exerciseTypeToRow(et)),
)

onMounted(() => {
  if (keycloak.subject) {
    exerciseTypeServise
      .get({ user_id: keycloak.subject })
      .then((res) => (exerciseTypes.value = res))
  }
})

function rowClick(row: { item: ExerciseType }) {
  isNew.value = false
  showDialog.value = true
  selectedType.value = exerciseTypes.value.find((et) => et.id === row.item.id) as ExerciseType
}

function addNew() {
  isNew.value = true
  selectedType.value = undefined
  showDialog.value = true
}

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

function initExerciseTypes() {
  exerciseTypeDuplicateServise
    .post()
    .then((res) => (exerciseTypes.value = exerciseTypes.value.concat(res)))
}
</script>

<template>
  <DataTable
    :headers="headers"
    :items="tableExerciseTypesRef"
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
