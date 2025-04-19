<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { UserService } from "@/services/user"
import { onMounted } from "vue"
import { ref, watchEffect } from "vue"
import type { User } from "@/types/user"
import { useTemplateRef } from "vue"
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "@/components/NotificationFloat.vue"
import { getUserFromEmail } from "@/utils/user"

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

const { notifications, addNotification } = useNotifications()
const users = ref<User[]>([])
const emailTemplate = useTemplateRef("emailInput")
const email = ref<string>()
const showNewDialog = ref(false)
const isFormValid = ref(false)
const isLoading = ref(false)

const emailRules = [
  (value: string) => !!value || "E-mail is required.",
  (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
]

watchEffect(() => {
  if (emailTemplate.value) {
    emailTemplate.value.focus()
  }
})

function rowClick(row: { item: User }) {
  console.log(row.item)
}

function sendEmail() {
  isLoading.value = true
  // TODO: Fix this nonsense
  if (email.value && getUserFromEmail(email.value))
    userService
      .post({ email: email.value, username: getUserFromEmail(email.value)! })
      .then((res) => {
        const newUser: User = { id: res.user_id, email: email.value!, nickname: "", name: "" }
        users.value.push(newUser)
        addNotification("User added succsefully!", "success")
      })
      .catch((err) => {
        addNotification(err, "error")
      })
      .finally(() => (isLoading.value = false))
}

function addNew() {
  email.value = ""
  isLoading.value = false
  showNewDialog.value = true
}

function exit() {
  showNewDialog.value = false
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

  <v-dialog :model-value="showNewDialog" @update:model-value="exit">
    <v-card>
      <v-card-title> Invite new user </v-card-title>
      <v-divider />
      <v-form v-model="isFormValid">
        <v-card-text>
          <v-text-field
            ref="emailInput"
            label="Email adddress"
            variant="outlined"
            v-model="email"
            clearable
            placeholder="Enter email address..."
            prepend-inner-icon="mdi-email"
            :rules="emailRules"
            validate-on="input"
            @keydown.enter.prevent
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="exit">Exit</v-btn>
          <v-btn
            :disabled="!isFormValid"
            :loading="isLoading"
            color="blue-darken-1"
            variant="text"
            @click="sendEmail"
            >Send</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
