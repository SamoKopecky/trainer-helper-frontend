<script setup lang="ts">
import { ref, watch, type ComputedRef } from "vue"
import { useTheme } from "vuetify"
import { getAllGroupIds, getColumns, getRowspan, groupBy } from "@/utils/exerciseTable"
import { computed } from "vue"
import type { ExerciseTableColumn, ExerciseTableData } from "@/types/exercise"
import type { ExerciseType } from "@/types/exerciseType"

const { exerciseTypes, columns, exercises } = defineProps({
  columns: {
    type: Array<ExerciseTableColumn>,
    required: true,
  },
  exercises: {
    type: Array<ExerciseTableData>,
    required: true,
  },
  exerciseTypes: {
    type: Array<ExerciseType>,
    required: true,
  },
})

function updateTable(row: ExerciseTableData) {
  emit("update-table", row)
}

function deleteExercise(exerciseId: number) {
  emit("delete-exercise", exerciseId)
}

const emit = defineEmits(["update-table", "delete-exercise", "display:exerciseType"])
const theme = useTheme()
const editable = ref(false)
const groups = ref<number[]>()
const localColumns = computed(() => {
  if (editable.value === false) {
    return columns.filter((c) => c.key !== "delete")
  }
  return columns
})

watch(
  () => exercises,
  (newExercises) => {
    groups.value = getAllGroupIds(newExercises)
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

function getExerciseType(id: number): string {
  return exerciseTypes.find((e) => e.id === id)?.name ?? ""
}

function displayExerciseType(exerciseTypeId: number) {
  emit("display:exerciseType", exerciseTypeId)
}
</script>

<template>
  <div :class="theme.global.current.value" />
  <v-checkbox v-model="editable" label="Edit table"></v-checkbox>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th
            v-for="column in localColumns"
            :key="column.key"
            :style="{ 'text-align': column.align }"
          >
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
            v-for="column in getColumns(localColumns, row)"
            :key="column.key"
            :rowspan="getRowspan(row, column)"
            :class="`col-${column.key.replace(/\_/g, '-')}`"
          >
            <input
              class="custom-table"
              v-if="column.type === 'number' || column.type === 'text'"
              v-model="row[column.key]"
              :type="column.type"
              @change="updateTable(row)"
            />

            <div v-else-if="column.type === 'groups'">
              <v-autocomplete
                v-if="editable"
                v-model="row[column.key]"
                class="autocomplete-input"
                variant="plain"
                density="compact"
                hide-details="auto"
                :items="groups"
                @update:model-value="updateTable(row)"
              />
              <span v-else> {{ row[column.key] }}</span>
            </div>

            <div v-else-if="column.type === 'exercise_types'">
              <div v-if="editable" class="d-flex align-center">
                <v-icon class="mr-2" @click="displayExerciseType(row[column.key])"
                  >mdi-information-outline</v-icon
                >
                <v-autocomplete
                  v-model="row[column.key]"
                  class="autocomplete-input"
                  variant="plain"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  hide-details="auto"
                  :items="exerciseTypes"
                  @update:model-value="updateTable(row)"
                />
              </div>
              <div v-else>
                <span @click="displayExerciseType(row[column.key])" style="cursor: pointer">
                  {{ getExerciseType(row[column.key]) }}
                </span>
              </div>
            </div>
            <v-icon
              v-else-if="column.type === 'button' && editable === true"
              x-small
              color="red"
              @click="deleteExercise(row.exercise_id)"
            >
              mdi-close
            </v-icon>
            <v-textarea
              v-else-if="column.type === 'textarea'"
              variant="plain"
              hide-details="auto"
              auto-grow
              clearable
              :rows="getRowspan(row, column)"
              v-model="row[column.key]"
              @change="updateTable(row)"
              @click:clear="updateTable(row)"
              placeholder="Click to enter notes"
            ></v-textarea>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="css" scoped>
/*
yellow: fde800
black : 000000
*/

.light {
  background-color: #ffffff;
  color: #000000;
}

.dark {
  background-color: #121212;
  color: #ffffff;
}

.table-container {
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-x: auto; /* Enable horizontal scrolling */
  max-width: 100%; /* Limit the container width to fit the parent */
  max-height: 100%;
}

@media (max-width: 2560px) {
  .custom-table {
    width: 50%;
    border-collapse: collapse;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 1920px) {
  .custom-table {
    width: 65%;
    border-collapse: collapse;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 1280px) {
  .custom-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
}

th,
td {
  text-align: left;
  padding-bottom: 0.3rem;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
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
  text-align: center;
}

.col-group-id {
  width: 5%;
}

.col-reps {
  width: 5%;
}

.col-rpe {
  width: 5%;
  max-width: 65px;
}

.col-work-set-count {
  width: 7%;
}

.col-intensity {
  width: 7%;
}

.col-exercise-type-id {
  width: 30%;
  min-width: 200px;
}

.col-note {
  width: 41%;
  min-width: 300px;
}
</style>
