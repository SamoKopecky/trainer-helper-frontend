<script setup lang="ts">
import { ref } from "vue"

defineProps({
  headers: {
    // @ts-expect-error idk why
    type: Unknown,
    required: true,
  },
  items: {
    // @ts-expect-error idk why
    type: Any,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const search = ref<string>()
const emit = defineEmits(["row-click", "add-new"])

function rowClick(event, item) {
  emit("row-click", item)
}

function addNew() {
  emit("add-new")
}
</script>

<template>
  <v-card :title="title" flat>
    <v-btn style="margin-left: 1rem" @click="addNew">Add new </v-btn>
    <template #text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>

    <v-data-table :headers="headers" :items="items" :search="search" @click:row="rowClick">
    </v-data-table>
  </v-card>
</template>
