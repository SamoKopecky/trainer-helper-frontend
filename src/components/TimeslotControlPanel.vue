<script setup lang="ts">
import type { AppTimeslot } from "@/types/calendar"
import type { PropType } from "vue"

const emit = defineEmits(["add-exercise"])

defineProps({
  appTimeslot: {
    type: Object as PropType<AppTimeslot>,
    required: false,
    default: undefined,
  },
})

function addExercise() {
  emit("add-exercise")
}
</script>

<template>
  <v-card
    class="mx-auto"
    prepend-icon="mdi-account"
    :title="appTimeslot?.title ?? 'loading...'"
    variant="text"
  >
    <v-card-text>{{ appTimeslot?.name ?? "loading..." }}</v-card-text>
  </v-card>
  <slot />
  <v-btn text="Add exercise" @click="addExercise" />
</template>

<style scoped>
.v-btn {
  margin: 10px 0px 10px 10px;
}
</style>
