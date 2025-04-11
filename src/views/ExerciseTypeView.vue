<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { ExerciseTypeService } from "@/services/exerciseType"
import type { ExerciseType } from "@/types/other"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { onMounted } from "vue"
import { ref } from "vue"

const exerciseTypeServise = new ExerciseTypeService()
const keycloak = useKeycloak()

const headers = ref([
  {
    align: "start",
    key: "name",
    title: "Name",
  },
  { key: "has_media", title: "Has Media" },
  { key: "media_type", title: "Media Type" },
  { key: "delete_btn", title: "Delete" },
])

const exerciseTypes = ref<ExerciseType[]>([])

onMounted(() => {
  if (keycloak.subject) {
    exerciseTypeServise.get({ user_id: keycloak.subject }).then((res) => {
      exerciseTypes.value = res
    })
  }
})

function rowClick(item) {
  console.log(item.index)
}

function addNew() {
  console.log("adding new!")
}
</script>

<template>
  <DataTable
    :headers="headers"
    :items="exerciseTypes"
    title="Exercise types"
    @row-click="rowClick"
    @add-new="addNew"
  ></DataTable>
</template>
