<script setup lang="ts">
import { deepClone, exerciseToTableData, randomId, workSetDiff } from "../utils/work_set"
import { WorkSetConnector } from "../backend-helpers/worksets"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { createVuetify } from "vuetify"
import type { ChangeNotification, ExerciseTableData, WorkSetTableRow } from "@/types"
import { watchDebounced } from "@vueuse/core"
import { ExerciseConnector } from "@/backend-helpers/exercise"

function removeNotification(notificationId: string) {
  notifications.value.delete(notificationId)
}

const WORK_SET_COLUMNS: WorkSetTableRow[] = [
  // { key: "group_id", type: null, name: "Group" },
  { key: "set_type", type: null, name: "Set Type" },
  { key: "work_set_count", type: null, name: "Set count" },
  { key: "reps", type: "number", name: "Repetitions" },
  { key: "intensity", type: "text", name: "Intensity" },
  { key: "rpe", type: "number", name: "RPE" },
  { key: "note", type: null, name: "Note" },
]

defineProps({
  id: String,
})

const route = useRoute()
const vuetify = ref(createVuetify())

const work_sets = ref<ExerciseTableData[]>([])
const work_sets_old: Map<number, ExerciseTableData[]> = new Map()

const notifications = ref<Map<string, ChangeNotification>>(new Map())

const workSetConnector = new WorkSetConnector()
const exerciseConnector = new ExerciseConnector()

const timeslot_id = Number(route.params.id)

function updateTable(row: ExerciseTableData) {
  const request = workSetDiff(row, work_sets_old[row.work_set_id])

  if (!request) {
    return
  }

  const notificationId = randomId()
  workSetConnector
    .put(request)
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

  work_sets_old[row.work_set_id] = deepClone(row)
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

function getRowspan(row: ExerciseTableData, column: WorkSetTableRow): number {
  if (column.key == "set_type" && row.set_type !== null) {
    return row.work_set_count
  }
  return 1
}

exerciseConnector.get(timeslot_id).then((exercise) => {
  const work_set_data_limits: ExerciseTableData[] = []
  exercise.forEach((e) => {
    work_set_data_limits.push(...exerciseToTableData(e))
  })

  work_sets.value = work_set_data_limits
  work_set_data_limits.forEach((row: ExerciseTableData) => {
    work_sets_old[row.work_set_id] = deepClone(row)
  })

  // NOTE: Add persistent storage so that a reload doesn't cancel data
  work_sets.value.forEach((row) => addWatchToRow(row))
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
          <th v-for="column in WORK_SET_COLUMNS" :key="column.key">
            {{ column.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in work_sets" :key="row.work_set_id">
          <td
            v-for="column in WORK_SET_COLUMNS"
            :key="column.key"
            :rowspan="getRowspan(row, column)"
          >
            <input
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
</style>
