<script setup lang="ts">
import { ref, watch, type ComputedRef } from "vue"
import {
  getAllGroupIds,
  getColumns,
  getGroupAlphabetMap,
  getRowspan,
  groupBy,
} from "@/utils/exerciseTable"
import { computed } from "vue"
import type { ExerciseTableColumn, ExerciseTableData } from "@/types/exercise"
import type { ExerciseType } from "@/types/exerciseType"

const { exerciseTypes, columns, exercises, isTableEditable } = defineProps({
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
  isTableEditable: {
    type: Boolean,
    reqyured: true,
  },
})

function updateTable(row: ExerciseTableData) {
  emit("update-table", row)
}

function deleteExercise(exerciseId: number) {
  emit("delete-exercise", exerciseId)
}

const emit = defineEmits([
  "update-table",
  "delete-exercise",
  "display:exerciseType",
  "update:copyWorkSet",
])
const groups = ref<number[]>()
const groupIdAlphabetMap = ref<Map<number, string>>()
const localColumns = computed(() => {
  if (isTableEditable === false) {
    return columns.filter((c) => c.key !== "delete")
  }
  return columns
})

watch(
  () => exercises,
  (newExercises) => {
    groups.value = getAllGroupIds(newExercises)
    groupIdAlphabetMap.value = getGroupAlphabetMap(newExercises)
  },
  { deep: true, immediate: true },
)

const exercisesByExerciseId: ComputedRef<Map<number, ExerciseTableData[]>> = computed(() => {
  return groupBy(exercises, (exercise) => exercise.exercise_id)
})

const lineDrawIds: ComputedRef<{ groupIds: number[]; exerciseIds: number[] }> = computed(() => {
  const groupIds: number[] = []
  const exerciseIds: number[] = []
  const exercisesByGroupId = groupBy(exercises, (exercise) => exercise.group_id)

  exercisesByExerciseId.value.forEach((exerciseGroup) => {
    exerciseGroup.forEach((row, index) => {
      // Only get work sets that are at the end of exercise
      if (index === exerciseGroup.length - 1) {
        const group = exercisesByGroupId.get(row.group_id) as ExerciseTableData[]
        // Only get work sets that are at the end of a multigroup exercise
        if (group[group.length - 1].exercise_id !== row.exercise_id) {
          exerciseIds.push(row.work_set_id)
        } else {
          groupIds.push(row.work_set_id)
        }
      }
    })
  })
  return { groupIds: groupIds, exerciseIds: exerciseIds }
})

function isCopyValid(row: ExerciseTableData, column: ExerciseTableColumn): boolean {
  const exerciseGroup = exercisesByExerciseId.value.get(row.exercise_id)
  if (exerciseGroup)
    return row.is_main && column.key != "work_set_count" && exerciseGroup.length > 1
  return false
}

function getExerciseType(id: number | undefined): string {
  if (id) return exerciseTypes.find((e) => e.id === id)?.name ?? ""
  return ""
}

function displayExerciseType(exerciseTypeId: number | undefined) {
  if (exerciseTypeId) emit("display:exerciseType", exerciseTypeId)
}
</script>

<template>
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
          :class="{
            'last-border': lineDrawIds.groupIds.includes(row.work_set_id),
            'exercise-mulitigroup': lineDrawIds.exerciseIds.includes(row.work_set_id),
          }"
        >
          <td
            v-for="column in getColumns(localColumns, row)"
            :key="column.key"
            :rowspan="getRowspan(row, column)"
            :class="`col-${column.key.replace(/\_/g, '-')}`"
          >
            <!-- Column: inputs -->
            <!-- Column: work set inputs -->
            <div v-if="['text', 'number'].includes(column.type)" class="d-flex align-center">
              <input v-model="row[column.key]" :type="column.type" @change="updateTable(row)" />
              <v-btn
                v-if="isCopyValid(row, column)"
                v-tooltip:top="'Copy'"
                icon
                size="small"
                variant="text"
                density="compact"
                @click="emit('update:copyWorkSet', row, column.key)"
              >
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
              <!-- Spacer -->
              <v-btn
                v-else
                icon
                size="small"
                style="visibility: hidden"
                variant="text"
                density="compact"
              />
            </div>

            <!-- Column: group -->
            <div v-else-if="column.key === 'group_id'">
              <v-autocomplete
                v-if="isTableEditable"
                v-model="row[column.key]"
                variant="plain"
                density="compact"
                hide-details="auto"
                :items="groups"
                @update:model-value="updateTable(row)"
              />
              <span v-else> {{ groupIdAlphabetMap?.get(row.exercise_id) }}</span>
            </div>

            <!-- Column: exercise type -->
            <div v-else-if="column.key === 'exercise_type_id'">
              <div v-if="isTableEditable" class="d-flex align-center">
                <v-btn
                  v-if="row[column.key]"
                  v-tooltip:top="'Show exercise details'"
                  icon="mdi-information-outline"
                  class="mr-1"
                  variant="text"
                  density="compact"
                  color="info"
                  @click="displayExerciseType(row[column.key])"
                />
                <v-autocomplete
                  v-model="row[column.key]"
                  variant="plain"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  hide-details="auto"
                  :items="exerciseTypes"
                  @update:model-value="updateTable(row)"
                />
              </div>
              <v-chip
                v-else
                v-tooltip:top="'Show exercise details'"
                label
                variant="text"
                @click="displayExerciseType(row[column.key])"
                class="chip"
              >
                {{ getExerciseType(row[column.key]) }}
              </v-chip>
            </div>

            <!-- Column: delete button -->
            <div v-else-if="column.key === 'delete' && isTableEditable" class="text-center">
              <v-btn
                v-tooltip:top="'Delete exercise'"
                icon
                variant="text"
                density="compact"
                color="error"
                @click="deleteExercise(row.exercise_id)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>

            <!-- Column: note  -->
            <v-textarea
              v-else-if="column.key === 'note'"
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
.table-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  max-width: 100%; /* Limit the container width to fit the parent */
  max-height: 100%;
}
.custom-table th {
  white-space: nowrap;
  padding: 10px 8px; /* Slightly more vertical padding */
  /* Use Vuetify variables for header background/color */
  background-color: rgba(var(--v-theme-on-surface), 0.03); /* Very subtle background */
  color: rgba(var(--v-theme-on-surface), 0.87); /* Standard text color */
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); /* Clear separation */
  font-weight: 600; /* Slightly bolder */
}

@media (max-width: 2560px) {
  .custom-table {
    width: 50%;
    font-size: 1rem;
    border-collapse: collapse;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .chip {
    font-size: 1rem;
  }
}

@media (max-width: 1920px) {
  .custom-table {
    width: 70%;
    font-size: 1rem;
    border-collapse: collapse;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .chip {
    font-size: 1rem;
  }
}

@media (max-width: 1280px) {
  .custom-table {
    width: 100%;
    font-size: 1rem;
    border-collapse: collapse;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .chip {
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .custom-table {
    width: 100%;
    font-size: 0.8rem;
    border-collapse: collapse;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .chip {
    font-size: 0.8rem;
  }
}

th,
td {
  text-align: left;
  padding-bottom: 0.3rem;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}

.custom-table tr {
  transition: background-color 0.3s;
}

.last-border {
  border-bottom: 1px solid;
}

.exercise-mulitigroup {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
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
