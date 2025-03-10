<script setup lang="ts">
import type { FullExerciseResponse } from "@/services/exercise"
import type { PropType } from "vue"

const emit = defineEmits(["add-exercise"])

defineProps({
  timeslotInfo: {
    type: Object as PropType<FullExerciseResponse> | null,
    required: false,
    default: { name: "loading..." } as FullExerciseResponse,
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
    :title="timeslotInfo?.user_id ?? 'No user'"
    variant="text"
  >
    <v-card-text>{{ timeslotInfo?.name ?? "-" }}</v-card-text>
  </v-card>
  <slot />
  <v-btn text="Add exercise" @click="addExercise" />
</template>

<style scoped>
.v-btn {
  margin: 10px 0px 10px 10px;
}
</style>
