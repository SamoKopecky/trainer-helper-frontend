<script setup lang="ts">
defineProps({
  isUndoActive: {
    type: Boolean,
    required: true,
  },
  isRedoActive: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["undo", "redo"])
</script>

<template>
  <v-spacer></v-spacer>
  <v-btn
    :disabled="!isUndoActive"
    v-tooltip:bottom="'Undo'"
    icon="mdi-undo-variant"
    @click="emit('undo')"
  />
  <v-btn
    :disabled="!isRedoActive"
    v-tooltip:bottom="'Redo'"
    icon="mdi-redo-variant"
    @click="emit('redo')"
  />
  <slot name="extra" />
  <v-spacer></v-spacer>
</template>
