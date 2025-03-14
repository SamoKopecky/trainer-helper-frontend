<script setup lang="ts">
import type { AppTimeslot } from "@/types/calendar"
import { useTemplateRef, watchEffect } from "vue"
import { ref, type PropType } from "vue"

const emit = defineEmits(["add-exercise", "update-title"])

defineProps({
  appTimeslot: {
    type: Object as PropType<AppTimeslot>,
    required: false,
    default: undefined,
  },
})

const titleEditable = ref(false)
const title = ref<string | unknown>()
const input = useTemplateRef("input")

watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
})
function buttonClick() {
  titleEditable.value = !titleEditable.value
  emit("update-title", title.value)
}

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
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="4" class="d-inline-flex align-center">
          <v-text-field
            ref="input"
            v-if="titleEditable"
            v-model="title"
            type="text"
            variant="plain"
            density="compact"
            placeholder="Enter new title"
            hide-details
            @keydown.enter="buttonClick"
          />
          <span v-if="!titleEditable">
            {{ appTimeslot?.name ?? "Title" }}
          </span>
          <v-icon small class="ml-2" @click="buttonClick">
            {{ titleEditable ? "mdi-check" : "mdi-pencil" }}
          </v-icon>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <slot />
  <v-btn text="Add exercise" @click="addExercise" />
</template>

<style scoped>
.v-btn {
  margin: 10px 0px 10px 10px;
}
</style>
