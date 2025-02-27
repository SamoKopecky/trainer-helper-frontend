<script setup lang="ts">
import { SetType, type ExerciseTableColumn, type ExerciseTableData } from "@/types"
import { ref } from "vue"
import { createVuetify } from "vuetify"

function getColumns(columns: ExerciseTableColumn[], row: ExerciseTableData): ExerciseTableColumn[] {
  if (!row.is_main) {
    return columns.filter((row) => !row.is_multirow)
  }
  return columns
}

function getRowspan(row: ExerciseTableData, column: ExerciseTableColumn): number {
  if (row.is_main && column.is_multirow) {
    return row.work_set_count_display
  }
  return 1
}

function updateTable(row: ExerciseTableData) {
  emit("update-table", row)
}

function deleteExercise(groupId: number) {
  emit("delete-exercise", groupId)
}

const emit = defineEmits(["update-table", "delete-exercise"])
const vuetify = ref(createVuetify())

defineProps({
  columns: {
    type: Array<ExerciseTableColumn>,
    required: true,
  },
  exercises: {
    type: Array<ExerciseTableData>,
    required: true,
  },
})
</script>

<template>
  <div :class="vuetify.theme.name" />
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in exercises" :key="row.work_set_id">
          <td
            v-for="column in getColumns(columns, row)"
            :key="column.key"
            :rowspan="getRowspan(row, column)"
          >
            <input
              :class="[column.key === 'note' ? 'large-input' : 'normal-input']"
              v-if="column.type === 'number' || column.type === 'text'"
              v-model="row[column.key]"
              :type="column.type"
              @change="updateTable(row)"
            />
            <v-autocomplete
              class="input"
              v-else-if="column.type === 'select'"
              variant="underlined"
              dense
              outlined
              v-model="row[column.key]"
              :items="Object.values(SetType).filter((type) => type !== SetType.None)"
              @update:model-value="updateTable(row)"
            />
            <v-icon
              x-small
              v-else-if="column.type === 'button'"
              color="red"
              @click="deleteExercise(row.group_id)"
            >
              <v-icon>mdi-close</v-icon>
            </v-icon>
            <span v-else>{{ row[column.key] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.clickable-icon {
  cursor: pointer; /* Makes the icon clickable */
}
.input {
  width: 100px;
}
.light {
  background-color: #ffffff;
  color: #000000;
}

.dark {
  background-color: #121212;
  color: #ffffff;
}

.table-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  max-width: 100%; /* Limit the container width to fit the parent */
  margin-bottom: 1rem; /* Space below the table */
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.custom-table th,
.custom-table td {
  padding: 12px 15px;
  text-align: left;
}

.light .custom-table th {
  background-color: #f5f5f5;
  color: #424242;
}

.dark .custom-table th {
  background-color: #333333;
  color: #ffffff;
}

.custom-table tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s;
}

.light .custom-table tr:hover {
  background-color: #f1f1f1;
}

.dark .custom-table tr:hover {
  background-color: #333333;
}

.custom-table td {
  font-size: 0.9rem;
}

.custom-table tr:last-child {
  border-bottom: none;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input {
  box-sizing: border-box; /* Include padding and border in width calculation */
}

.large-input {
  width: 100%;
  /* TODO: Fix this later */
  height: 100%;
}
</style>
