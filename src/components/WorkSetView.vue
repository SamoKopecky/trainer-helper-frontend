<script setup lang="ts">
import { deepClone, workSetDiff } from "@/utils"
import {
  WorkSetConnector,
  type WorkSet,
  type WorkSetPostRequest,
} from "../backend-helpers/worksets"
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import { createVuetify } from "vuetify"
import type { ChangeNotification } from "@/types"
import { randomUUID } from "crypto"

function removeNotification(notificationId: string) {
  notifications.value.delete(notificationId)
}

const WORK_SET_COLUMNS: (keyof WorkSet)[] = ["set_type", "intensity", "rpe", "tempo", "note"]

defineProps({
  id: String,
})

const route = useRoute()
const vuetify = ref(createVuetify())

const work_sets_values = ref<WorkSet[]>([])
let work_sets_values_copy: WorkSet[] = []

const notifications = ref<Map<string, ChangeNotification>>(new Map())

const connector = new WorkSetConnector()
const request: WorkSetPostRequest = {
  timeslot_id: Number(route.params.id),
}

connector.post(request).then((work_set) => {
  const work_set_res = work_set.map((work_set) => work_set)
  work_sets_values.value = work_set_res
  work_sets_values_copy = work_set_res
})
// TODO: add input type

// NOTE: Possible improvment, watch each row separatly
watch(
  work_sets_values,
  async (newValues: WorkSet[]) => {
    // TODO: Add debounce function

    newValues.forEach((row, index) => {
      const request = workSetDiff(row, work_sets_values_copy[index])
      if (request) {
        const notificationId = (Math.random() + 1).toString(36).substring(2)
        connector
          .put(request)
          .then(() => {
            notifications.value.set(notificationId, {
              text: "Update succesful",
              type: "success",
            } as ChangeNotification)
          })
          .catch((error: Error) => {
            notifications.value.set(notificationId, {
              text: error.message,
              type: "error",
            } as ChangeNotification)
          })
          .finally(() => {
            setTimeout(() => removeNotification(notificationId), 2000)
          })
      }
    })

    work_sets_values_copy = deepClone(newValues)
  },
  { deep: true },
)
</script>

<template>
  <h1>Work set</h1>
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
          <th v-for="column in WORK_SET_COLUMNS" :key="column">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in work_sets_values" :key="row.id">
          <td v-for="column in WORK_SET_COLUMNS" :key="column">
            <input v-model="row[column]" :size="Math.max(1, String(row[column]).length)" />
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
  max-width: 100%; /* Ensure it doesn't overflow the container */
  padding: 16px; /* Add padding for content spacing */
  background-color: #f0f0f0; /* Optional: Set a background color */
}
</style>
