<script setup lang="ts">
import type { User } from "@/types/user"
import { watchDebounced } from "@vueuse/core"
import { useTemplateRef, watchEffect } from "vue"
import { ref, watch, type PropType } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object as PropType<User | undefined>,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits(["update:modelValue", "update:nickname", "delete:user"])
const input = useTemplateRef("input")
const nickname = ref<string>()
const router = useRouter()

watch(
  () => props.user,
  () => {
    if (props.user) nickname.value = props.user?.nickname
  },
)

watchEffect(() => {
  if (input.value) {
    input.value.focus()
  }
})

watchDebounced(
  nickname,
  () => {
    if (nickname.value) {
      saveButton()
    }
  },
  { debounce: 1000 },
)

function goToAthlete(userId: string) {
  router.push({ path: `/athlete/${userId}` })
}

function exitButton() {
  emit("update:modelValue", false)
}

function saveButton() {
  emit("update:nickname", nickname.value)
}

function unregisterUser() {
  emit("delete:user")
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="exitButton" max-width="500px">
    <v-card>
      <v-card-title> {{ user?.nickname ?? user?.name ?? user?.email }} </v-card-title>
      <v-divider />
      <v-card-text>
        <v-text-field
          ref="input"
          label="Nickname"
          variant="outlined"
          v-model="nickname"
          clearable
          placeholder="Choose a nickname..."
          prepend-inner-icon="mdi-account"
        />
        <v-btn class="mr-2" @click="goToAthlete(user!.id)">Athlete Info</v-btn>
        <v-btn color="red-darken-1" @click="unregisterUser">Unregister user</v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey-darken-1" variant="text" @click="exitButton">Exit</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveButton">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
