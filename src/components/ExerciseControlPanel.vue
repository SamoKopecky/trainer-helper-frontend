<script setup lang="ts">
// TODO: Rewrite all events in create:...
const emit = defineEmits(["add-exercise", "duplicate-timeslot", "create:exercise-type"])

defineProps({
  isTrainer: {
    type: Boolean,
    required: true,
  },
})

function addExercise() {
  emit("add-exercise")
}

function addNewExerciseType() {
  emit("create:exercise-type")
}
</script>

<template>
  <slot />
  <v-btn class="mt-2 mr-2" text="Add exercise" @click="addExercise" />
  <v-btn class="mt-2" v-if="isTrainer" text="Add exercise type" @click="addNewExerciseType" />
</template>
