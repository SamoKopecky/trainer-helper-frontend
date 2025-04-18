<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { ref } from "vue"

const headers = ref([
  {
    align: "start",
    key: "full_name",
    title: "Full Name",
  },
  { key: "nickname", title: "Nickname" },
  { key: "id", align: " d-none" },
])

function rowClick(row: { item: any }) {
  console.log(row.item)
}

function addNew() {
  console.log("new")
}
</script>

<template>
  <DataTable
    :headers="headers"
    :items="[]"
    title="Athletes"
    @add-new="addNew"
    @row-click="rowClick"
  />
</template>
