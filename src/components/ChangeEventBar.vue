<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  isUndoActive: {
    type: Boolean,
    required: true,
  },
  isRedoActive: {
    type: Boolean,
    required: true,
  },
  justify: {
    type: String,
    required: false,
    default: "center",
    validator: (value: string) => ["start", "center"].includes(value),
  },
})

const emit = defineEmits(["undo", "redo"])
const justificationClass = computed(() => `justify-${props.justify}`)
</script>

<template>
  <div class="d-flex" :class="[justificationClass]">
    <v-btn
      :disabled="!isUndoActive"
      v-tooltip:bottom="'Undo'"
      icon="mdi-undo-variant"
      variant="text"
      @click="emit('undo')"
    />
    <v-btn
      :disabled="!isRedoActive"
      v-tooltip:bottom="'Redo'"
      icon="mdi-redo-variant"
      variant="text"
      @click="emit('redo')"
    />
    <slot name="extra" />
  </div>
</template>
