<script setup lang="ts">
import ExercisesPanel from "@/components/ExercisesPanel.vue"

defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <ExercisesPanel :id="id"> </ExercisesPanel>
</template>
