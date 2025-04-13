<script setup lang="ts">
import { ref, type PropType } from "vue"

defineProps({
  headers: {
    type: Object as PropType<any[]>,
    required: true,
  },
  items: {
    type: Object as PropType<any[]>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const search = ref<string>()
const emit = defineEmits(["row-click", "add-new"])

function rowClick(_event: Event, item: unknown) {
  emit("row-click", item)
}

function addNew() {
  emit("add-new")
}
</script>

<template>
  <v-card :title="title" flat>
    <template #text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
      <v-btn style="margin-top: 0.5rem" @click="addNew">Add new</v-btn>

      <v-data-table :headers="headers" :items="items" :search="search" @click:row="rowClick">
        <!-- Hack to use slots in parent -->
        <template v-for="header in headers" #[`item.${header.key}`]="{ item }">
          <slot :name="`item.${header.key}`" :item="item" :value="item[header.key]">
            {{ item[header.key] }}
          </slot>
        </template>
      </v-data-table>

      <slot name="extra-content" />
    </template>
  </v-card>
</template>
