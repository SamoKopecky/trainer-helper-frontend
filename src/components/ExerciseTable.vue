<script setup lang="ts">
import { type ExerciseTableColumn, type ExerciseTableData } from "../types"
import { ref, watch, type ComputedRef } from "vue"
import { createVuetify } from "vuetify"
import {
  getAllGroupIds,
  generateSetTypes,
  getColumns,
  getRowspan,
  groupBy,
} from "../utils/exerciseTable"
import { computed } from "vue"

const { columns, exercises } = defineProps({
  columns: {
    type: Array<ExerciseTableColumn>,
    required: true,
  },
  exercises: {
    type: Array<ExerciseTableData>,
    required: true,
  },
})

function updateTable(row: ExerciseTableData) {
  emit("update-table", row)
}

function deleteExercise(exerciseId: number) {
  emit("delete-exercise", exerciseId)
}

const emit = defineEmits(["update-table", "delete-exercise"])
const vuetify = ref(createVuetify())
const selectItems = ref<Map<string, (string | number)[]>>(new Map())
selectItems.value.set("set_type", generateSetTypes())

watch(
  () => exercises,
  (newExercises) => {
    selectItems.value.set("group_id", getAllGroupIds(newExercises))
  },
  { deep: true },
)

const drawWhen: ComputedRef<number[]> = computed(() => {
  const res: number[] = []
  const exercisesByGroupId = groupBy(exercises, (exercise) => exercise.group_id)
  const exercisesByExerciseId = groupBy(exercises, (exercise) => exercise.exercise_id)

  exercisesByExerciseId.forEach((exerciseGroup) => {
    exerciseGroup.forEach((row, index) => {
      const group = exercisesByGroupId.get(row.group_id) as ExerciseTableData[]
      if (
        index === exerciseGroup.length - 1 &&
        exerciseGroup.length !== group.length &&
        group[group.length - 1].exercise_id !== row.exercise_id
      ) {
        return
      }
      res.push(row.work_set_id)
    })
  })
  return res
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
        <tr
          v-for="row in exercises"
          :key="row.work_set_id"
          :class="{ 'last-border': drawWhen.includes(row.work_set_id) }"
        >
          <td
            v-for="column in getColumns(columns, row)"
            :key="column.key"
            :rowspan="getRowspan(row, column)"
            :class="`col-${column.key.replace(/\_/g, '-')}`"
          >
            <input
              v-if="column.type === 'number' || column.type === 'text'"
              v-model="row[column.key]"
              :type="column.type"
              @change="updateTable(row)"
            />
            <v-autocomplete
              v-else-if="column.type === 'select'"
              v-model="row[column.key]"
              class="autocomplete-input"
              variant="plain"
              density="compact"
              hide-details="auto"
              :items="selectItems.get(column.key)"
              @update:model-value="updateTable(row)"
            />
            <v-icon
              v-else-if="column.type === 'button'"
              x-small
              color="red"
              @click="deleteExercise(row.exercise_id)"
            >
              <v-icon>mdi-close</v-icon>
            </v-icon>
            <textarea
              v-else-if="column.type === 'textarea'"
              v-model="row[column.key]"
              @change="updateTable(row)"
            />
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

.autocomplete-input {
  width: 100px;
}

textarea {
  border: none;
  width: 100%;
  -webkit-box-sizing: border-box; /* <=iOS4, <= Android  2.3 */
  -moz-box-sizing: border-box; /* FF1+ */
  box-sizing: border-box; /* Chrome, IE8, Opera, Safari 5.1*/
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
  max-height: 100%;
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
  padding: 3px 10px;
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
  transition: background-color 0.3s;
}

.last-border {
  border-bottom: 1px solid #e0e0e0;
}

.light .custom-table tr:hover {
  background-color: #f1f1f1;
}

.dark .custom-table tr:hover {
  background-color: #333333;
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
  width: 100%;
}

.col-reps {
  width: 6%;
}

.col-rpe {
  width: 5%;
}

.col-work-set-count {
  width: 7%;
}

.col-intensity {
  width: 5%;
}

.col-group-id {
  width: 5%;
}

.col-set-type {
  width: 10%;
}

.col-delete {
  width: 2%;
  text-align: center;
  align-items: center;
}
</style>
