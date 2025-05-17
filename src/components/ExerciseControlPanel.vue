<script setup lang="ts">
import type { Timeslot } from "@/types/other"
import { onMounted } from "vue"
import { computed } from "vue"
import { useTemplateRef, watchEffect } from "vue"
import { ref } from "vue"
import { deepClone } from "@/utils/tranformators"

// TODO: Rewrite all events in create:...
const emit = defineEmits(["add-exercise", "duplicate-timeslot", "create:exercise-type"])

defineProps({
  isTrainer: {
    type: Boolean,
    required: true,
  },
})

const duplicateDialog = ref(false)
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

onMounted(() => {
  // const request = {
  //   // TODO: Adjust start_date
  //   start_date: "2025-01-20T12:00:00Z",
  //   end_date: "2026-02-28T20:15:00Z",
  // }
  // FIXME: todo
  // timeslotService.get(request).then((res) => (duplicateTimeslots.value = res))
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
