<script setup lang="ts">
import type { CalTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { ref, useTemplateRef, watch, watchEffect, type PropType } from "vue"
import { EMPTY_USER } from "@/constants"
import { useUsers } from "@/composables/useUsers"

const { selectedEvent, modelValue } = defineProps({
  selectedEvent: {
    type: Object as PropType<CalTimeslot | null>,
    required: false,
    default: null,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  isTrainer: {
    type: Boolean,
    required: true,
  },
})

watch(
  () => selectedEvent,
  () => {
    selectedId.value = undefined
    titleEditable.value = selectedEvent?.title === EMPTY_USER
  },
)

const selectedId = ref<string | undefined>()
const { users, userDisplay } = useUsers()
const titleEditable = ref(false)
const router = useRouter()
const emit = defineEmits(["delete-cal-timeslot", "update:modelValue", "update-user"])
const input = useTemplateRef("input")

watchEffect(() => {
  if (input.value) {
    input.value.focus()
  }
})

function redirectExercise(timeslot: CalTimeslot | null) {
  router.push({ path: `/timeslot/${timeslot?.id}` })
}

function deleteCalTimeslot(event: CalTimeslot | null) {
  emit("delete-cal-timeslot", event)
}

function closeDialog() {
  emit("update:modelValue", false)
}

function buttonClick() {
  titleEditable.value = !titleEditable.value
  emit(
    "update-user",
    users.value?.find((p) => p.id === selectedId.value),
  )
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog">
    <v-card>
      <v-card-title>
        <div style="display: flex; align-items: center; width: 100%">
          <!-- Static Title -->
          <span v-if="!titleEditable" style="flex: 1"> {{ selectedEvent?.title }}</span>

          <!-- Editable Title -->
          <v-autocomplete
            ref="input"
            v-if="titleEditable"
            v-model="selectedId"
            :items="users"
            :item-title="userDisplay"
            item-value="id"
            placeholder="Enter name"
            variant="plain"
            density="compact"
            hide-details="auto"
            @keydown.enter="buttonClick"
          />

          <!-- Edit Icon -->
          <v-icon v-if="isTrainer" small class="ml-2" @click="buttonClick">
            {{ titleEditable ? "mdi-check" : "mdi-pencil" }}
          </v-icon>
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p style="padding-bottom: 1rem">{{ selectedEvent?.name }}</p>
        <v-btn
          style="margin-left: 0px"
          text="Go to timeslot"
          @click="redirectExercise(selectedEvent)"
        />
        <v-btn v-if="isTrainer" text="Delete timeslot" @click="deleteCalTimeslot(selectedEvent)" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  margin: 1rem 0px 0px 1rem;
}
</style>
