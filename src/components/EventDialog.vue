<script setup lang="ts">
import type { CalTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { ref, useTemplateRef, watch, watchEffect, type PropType } from "vue"
import { EMPTY_USER } from "@/constants"
import type { Person } from "@/types/other"
import { onMounted } from "vue"
import { PersonService } from "../services/person"

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
})

watch(
  () => selectedEvent,
  () => {
    selectedId.value = undefined
    titleEditable.value = selectedEvent?.title === EMPTY_USER
  },
)

const selectedId = ref<number | undefined>()
const persons = ref<Person[]>()
const titleEditable = ref(false)
const router = useRouter()
const emit = defineEmits(["delete-cal-timeslot", "update:modelValue", "update-person"])
const personService = new PersonService()
const input = useTemplateRef("input")

watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
})

function redirectExercise(timeslot: CalTimeslot | null) {
  router.push({ path: `/exercise/${timeslot?.id}` })
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
    "update-person",
    persons.value?.find((p) => p.id === selectedId.value),
  )
}

onMounted(() => {
  personService.get().then((res) => (persons.value = res))
})
</script>

<template>
  <v-dialog max-width="500" :model-value="modelValue" @update:model-value="closeDialog">
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
            :items="persons"
            item-title="name"
            item-value="id"
            placeholder="Enter name"
            variant="plain"
            density="compact"
            hide-details="auto"
            @keydown.enter="buttonClick"
          />

          <!-- Edit Icon -->
          <v-icon small class="ml-2" @click="buttonClick">
            {{ titleEditable ? "mdi-check" : "mdi-pencil" }}
          </v-icon>
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p style="padding-bottom: 1rem">{{ selectedEvent?.name }}</p>
        <v-btn
          style="margin-left: 0px"
          text="Go exericse"
          @click="redirectExercise(selectedEvent)"
        />
        <v-btn text="Delete timeslot" @click="deleteCalTimeslot(selectedEvent)" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  margin: 1rem 0px 0px 1rem;
}
</style>
