<script setup lang="ts">
import {
  deepClone,
  exerciseToTableData,
  randomId,
  tableDataDiff,
  getRowspan,
  getColumns,
} from "@/utils/exercise"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { createVuetify } from "vuetify"
import {
  ExerciseUpdateType,
  type ChangeNotification,
  type ExerciseTableData,
  type ExerciseTableColumn,
  type ExerciseDiff,
  type WorkSetModel,
} from "@/types"
import { watchDebounced } from "@vueuse/core"
import { ExerciseConnector, type ExercisePutRequest } from "@/backendHelpers/exercise"
import { WorkSetConnector, type WorkSetPutRequest } from "@/backendHelpers/worksets"
import {
  ExerciseCountConnector,
  type ExerciseCountPutRequest,
  type ExerciseCountPutResponse,
} from "@/backendHelpers/exerciseCount"

function removeNotification(notificationId: string) {
  notifications.value.delete(notificationId)
}

const EXERCISE_COLUMNS: ExerciseTableColumn[] = [
  { key: "group_id", type: null, name: "Group", is_multirow: true },
  { key: "set_type", type: null, name: "Set Type", is_multirow: true },
  { key: "work_set_count", type: "number", name: "Set count", is_multirow: true },
  { key: "reps", type: "number", name: "Repetitions", is_multirow: false },
  { key: "intensity", type: "text", name: "Intensity", is_multirow: false },
  { key: "rpe", type: "number", name: "RPE", is_multirow: false },
  { key: "note", type: "text", name: "Note", is_multirow: true },
]

defineProps({
  id: String,
})

const route = useRoute()
const vuetify = ref(createVuetify())

const exercises = ref<ExerciseTableData[]>([])
const exercises_old: Map<number, ExerciseTableData[]> = new Map()

const notifications = ref<Map<string, ChangeNotification>>(new Map())

const workSetConnector = new WorkSetConnector()
const exerciseConnector = new ExerciseConnector()
const exerciseCountConnector = new ExerciseCountConnector()

const timeslot_id = Number(route.params.id)

function putResponseToRow(update: WorkSetModel): ExerciseTableData {
  const exerciseData = exercises.value.find((e) => e.exercise_id == update.exercise_id)
  const res: ExerciseTableData = {
    exercise_id: update.exercise_id,
    rpe: update.rpe,
    reps: update.reps,
    is_main: false,
    work_set_count_display: exerciseData?.work_set_count_display,
  }
  return res
}

function doUpdate(data: ExerciseDiff, updateType: ExerciseUpdateType): Promise<void> {
  if (updateType === ExerciseUpdateType.WorkSet) {
    return workSetConnector.put(data as WorkSetPutRequest)
  } else if (updateType == ExerciseUpdateType.Exercise) {
    return exerciseConnector.put(data as ExercisePutRequest)
  } else {
    return new Promise(async () => {
      const updates = await exerciseCountConnector.put_return(data as ExerciseCountPutRequest)
      const newWorkSets: ExerciseTableData[] = []
      exercises.value.push(...newWorkSets)
    })
  }
}

function updateTable(newRow: ExerciseTableData) {
  const [diff, updateType] = tableDataDiff(newRow, exercises_old[newRow.work_set_id])

  if (!diff || !updateType) {
    return
  }

  const notificationId = randomId()
  doUpdate(diff, updateType)
    .then(() => {
      notifications.value.set(notificationId, {
        text: "Update succesful",
        type: "success",
      })
    })
    .catch((error: Error) => {
      notifications.value.set(notificationId, {
        text: error.message,
        type: "error",
      })
    })
    .finally(() => {
      setTimeout(() => removeNotification(notificationId), 2000)
    })

  exercises_old[newRow.work_set_id] = deepClone(newRow)
}

function addWatchToRow(row: ExerciseTableData) {
  watchDebounced(
    row,
    async () => {
      updateTable(row)
    },
    {
      deep: true,
      debounce: 1000,
      maxWait: 5000,
    },
  )
}

exerciseConnector.get(timeslot_id).then((exercise) => {
  const exercise_data: ExerciseTableData[] = []
  exercise.forEach((e) => {
    exercise_data.push(...exerciseToTableData(e))
  })

  exercises.value = exercise_data
  exercise_data.forEach((row: ExerciseTableData) => {
    exercises_old[row.work_set_id] = deepClone(row)
  })

  // NOTE: Add persistent storage so that a reload doesn't cancel data
  exercises.value.forEach((row) => addWatchToRow(row))
})
</script>

<template>
  <div :class="vuetify.theme.name" />
  <div class="notification">
    <v-slide-y-transition group>
      <v-alert
        v-for="notification in notifications"
        class="top-alert"
        closable
        :key="notification[0]"
        :type="notification[1].type"
        >{{ notification[1].text }}</v-alert
      >
    </v-slide-y-transition>
  </div>
  <div>
    <table class="custom-table">
      <thead>
        <tr>
          <th v-for="column in EXERCISE_COLUMNS" :key="column.key">
            {{ column.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in exercises" :key="row.work_set_id">
          <td
            v-for="column in getColumns(EXERCISE_COLUMNS, row)"
            :key="column.key"
            :rowspan="getRowspan(row, column)"
          >
            <input
              :class="[column.key === 'note' ? 'large-input' : 'normal-input']"
              v-if="column.type"
              v-model="row[column.key]"
              :type="column.type"
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
.light {
  background-color: #ffffff;
  color: #000000;
}

.dark {
  background-color: #121212;
  color: #ffffff;
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

.notification {
  position: relative; /* Make the container a positioned element */
}

.top-alert {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000; /* Ensure the alert is above other content */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  margin-top: 10px;
  max-width: 100%; /* Ensure it doesn't overflow the container */
  padding: 16px; /* Add padding for content spacing */
  background-color: #f0f0f0; /* Optional: Set a background color */
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
