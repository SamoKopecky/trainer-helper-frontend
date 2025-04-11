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

const exerciseTypeServise = new ExerciseTypeService()
const exerciseTypeDuplicateServise = new ExerciseTypeDuplicateService()
const keycloak = useKeycloak()

const headers = ref([
  {
    align: "start",
    key: "name",
    title: "Name",
  },
  { key: "has_media", title: "Has Media" },
  { key: "media_type", title: "Media Type" },
])

const exerciseTypes = ref<ExerciseType[]>([])
const tableExerciseTypes: ComputedRef<ExerciseTypeTableRow[]> = computed(() => {
  return exerciseTypes.value.map((et) => {
    return {
      name: et.name,
      media_type: et.media_type ?? "-",
      has_media: et.media_type !== undefined ? "No" : "Yes",
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

function rowClick(item) {
  console.log(item.index)
}

function addNew() {
  console.log("new")
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
</template>
