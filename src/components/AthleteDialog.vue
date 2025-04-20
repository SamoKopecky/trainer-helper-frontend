<script setup lang="ts">
import type { User } from "@/types/user"
import { watchDebounced } from "@vueuse/core"
import { ref, type PropType } from "vue"

defineProps({
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
const nickname = ref<string>()

watchDebounced(
  nickname,
  () => {
    if (nickname.value) {
      saveButton()
    }
  },
  { debounce: 1000 },
)

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
  <v-dialog :model-value="modelValue" @update:model-value="exitButton">
    <v-card>
      <v-card-title> {{ user?.nickname ?? user?.name ?? user?.email }} </v-card-title>
      <v-divider />
      <v-card-text>
        <v-text-field
          label="Nickname"
          variant="outlined"
          v-model="nickname"
          clearable
          placeholder="Choose a nickname..."
          prepend-inner-icon="mdi-account"
        />
        <v-btn color="red-darken-1" @click="unregisterUser">Unregister user</v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey-darken-1" variant="text" @click="exitButton">Exit</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveButton">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
