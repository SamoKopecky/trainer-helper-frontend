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
const loading = ref(false)
const userService = new UserService()
const { notifications, addNotification } = useNotifications()
const {
  isLoading,
  showDialog: showNewDialog,
  sendEmail,
} = useNewAthleteDialog(addNotification, users)
const { showDialog, user, deleteUser, updateNickname } = useAthleteDialog(addNotification, users)

function rowClick(row: { item: User }) {
  showDialog.value = true
  user.value = row.item
}

function addNew() {
  isLoading.value = false
  showNewDialog.value = true
}

onMounted(() => {
  loading.value = true
  userService.get().then((res) => {
    users.value = res
    loading.value = false
  })
})
</script>

<template>
  <NotificationFloat :notifications="notifications" />

  <DataTable
    :headers="headers"
    :items="users"
    :loading="loading"
    title="Athletes"
    @add-new="addNew"
    @row-click="rowClick"
  />

  <NewAthleteDialog v-model="showNewDialog" :is-loading="isLoading" @create:email="sendEmail" />
  <AthleteDialog
    v-model="showDialog"
    :user="user"
    @delete:user="deleteUser"
    @update:nickname="updateNickname"
  ></AthleteDialog>
</template>
