<script setup lang="ts">
import { watch } from "vue"
import { ref, watchEffect } from "vue"
import { useTemplateRef } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["create:email", "update:modelValue"])
const email = ref<string>()
const emailTemplate = useTemplateRef("emailInput")
const isFormValid = ref(false)

const emailRules = [
  (value: string) => !!value || "E-mail is required.",
  (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
]

watch(
  () => props.modelValue,
  () => {
    email.value = ""
  },
)

watchEffect(() => {
  if (emailTemplate.value) {
    emailTemplate.value.focus()
  }
})

function exitButton() {
  emit("update:modelValue", false)
}

function sendEmail() {
  emit("create:email", email.value)
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="exitButton">
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
          <v-btn color="grey-darken-1" variant="text" @click="exitButton">Exit</v-btn>
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
