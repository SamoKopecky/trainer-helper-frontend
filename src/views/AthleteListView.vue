<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { ref } from "vue"
import type { User } from "@/types/user"
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "@/components/NotificationFloat.vue"
import NewAthleteDialog from "@/components/NewAthleteDialog.vue"
import AthleteDialog from "@/components/AthleteDialog.vue"
import { useNewAthleteDialog } from "@/composables/useNewAthleteDialog"
import { useAthleteDialog } from "@/composables/useAthleteDialog"
import { onMounted } from "vue"
import { UserService } from "@/services/user"

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
const userService = new UserService()
const { notifications, addNotification } = useNotifications()
const {
  isLoading,
  showDialog: showNewDialog,
  sendEmail,
} = useNewAthleteDialog(addNotification, users)
const { showDialog, user, deleteUser } = useAthleteDialog(addNotification, users)

function rowClick(row: { item: User }) {
  console.log(row.item)
  showDialog.value = true
  user.value = row.item
}

function addNew() {
  isLoading.value = false
  showNewDialog.value = true
}

onMounted(() => {
  userService.get().then((res) => {
    users.value = res
  })
})
</script>

<template>
  <NotificationFloat :notifications="notifications" />

  <DataTable
    :headers="headers"
    :items="users"
    title="Athletes"
    @add-new="addNew"
    @row-click="rowClick"
  />

  <NewAthleteDialog v-model="showNewDialog" :is-loading="isLoading" @create:email="sendEmail" />
  <AthleteDialog
    v-model="showDialog"
    :user="user"
    @delete:user="deleteUser(user?.id)"
  ></AthleteDialog>
</template>
