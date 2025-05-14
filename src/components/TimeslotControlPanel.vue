<script setup lang="ts">
import type { AppTimeslot } from "@/types/calendar"
import type { Timeslot } from "@/types/other"
import { onMounted } from "vue"
import { computed } from "vue"
import { useTemplateRef, watch, watchEffect } from "vue"
import { ref, type PropType } from "vue"
import { TimeslotService } from "@/services/timeslots"
import { deepClone } from "@/utils/tranformators"

// TODO: Rewrite all events in create:...
const emit = defineEmits([
  "add-exercise",
  "update-title",
  "duplicate-timeslot",
  "create:exercise-type",
])
const timeslotService = new TimeslotService()

const { appTimeslot } = defineProps({
  appTimeslot: {
    type: Object as PropType<AppTimeslot>,
    required: false,
    default: undefined,
  },
  isTrainer: {
    type: Boolean,
    required: true,
  },
})

const nameEditable = ref(false)
const duplicateDialog = ref(false)
const timeslotName = ref<string | unknown>()
const duplicateInput = useTemplateRef("duplicateInput")
const duplicateTimeslotId = ref<number | undefined>()
const duplicateTimeslots = ref<Timeslot[]>([])

const computedDuplicateTimeslots = computed(() => {
  return duplicateTimeslots.value.map((timeslot) => {
    const timeslotCopy = deepClone(timeslot)
    const dayString = timeslot.start.toLocaleString("en-US", { weekday: "long" })
    const date = timeslot.start.toLocaleDateString().split("/")
    const userName = timeslot.user_nickname ?? timeslot.user_name
    timeslotCopy.name = `${userName} | ${dayString} ${date[1]}-${date[0]} | ${timeslot.name}`
    return timeslotCopy
  })
})

watchEffect(() => {
  if (duplicateInput.value) {
    duplicateInput.value.focus()
  }
})

watch(
  // Fill in input field with old name
  () => appTimeslot,
  () => {
    timeslotName.value = appTimeslot?.name
  },
)

onMounted(() => {
  const request = {
    // TODO: Adjust start_date
    start_date: "2025-01-20T12:00:00Z",
    end_date: "2026-02-28T20:15:00Z",
  }
  timeslotService.get(request).then((res) => (duplicateTimeslots.value = res))
})

function duplicate() {
  duplicateDialog.value = true
}

function addExercise() {
  emit("add-exercise")
}

function submitDuplicate() {
  duplicateDialog.value = false
  emit("duplicate-timeslot", duplicateTimeslotId.value)
}

function addNewExerciseType() {
  emit("create:exercise-type")
}
</script>

<template>
  <v-card
    class="mx-auto"
    prepend-icon="mdi-account"
    :title="appTimeslot?.title ?? 'loading...'"
    variant="text"
  >
    <v-card-text>
      <span v-if="!nameEditable">
        {{ appTimeslot?.name ?? "Title" }}
      </span>
    </v-card-text>
  </v-card>
  <slot />
  <v-btn text="Add exercise" @click="addExercise" />
  <v-btn v-if="isTrainer" text="Add exercise type" @click="addNewExerciseType" />
  <v-btn v-if="isTrainer" text="Duplicate from another timeslot" @click="duplicate" />

  <v-dialog v-model="duplicateDialog">
    <v-card title="Duplicate timeslot">
      <v-divider />
      <v-card-text>
        <v-autocomplete
          ref="duplicateInput"
          variant="outlined"
          v-model="duplicateTimeslotId"
          :items="computedDuplicateTimeslots"
          item-title="name"
          item-value="id"
          hide-details="auto"
          placeholder="Select timelost to duplicate"
          @keydown.enter="submitDuplicate"
        />
        <span>Warning: this will override your current exercises</span>
        <br />
        <v-btn text="Confirm" @click="submitDuplicate"></v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  margin: 1rem 0px 10px 1rem;
}
</style>
