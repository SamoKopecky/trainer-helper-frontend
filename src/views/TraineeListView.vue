<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { UserService } from "@/services/user"
import { onMounted } from "vue"
import { ref } from "vue"
import type { User } from "@/types/user"

const userService = new UserService()
const headers = ref([
  {
    align: "start",
    key: "name",
    title: "Full Name",
  },
  { key: "nickname", title: "Nickname" },
  { key: "email", title: "Email" },
  { key: "id", align: " d-none" },
])
const users = ref<User[]>([])

function rowClick(row: { item: any }) {
  console.log(row.item)
}

function addNew() {
  console.log("new")
}

onMounted(() => {
  userService.get().then((res) => {
    users.value = res
  })
})
</script>

<template>
  <DataTable
    :headers="headers"
    :items="users"
    title="Athletes"
    @add-new="addNew"
    @row-click="rowClick"
  />
</template>
