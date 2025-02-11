<script setup lang="ts">
import {
  WorkSetConnector,
  type WorkSet,
  type WorkSetPutRequest,
  type WorkSetRequest,
} from "../backend-helpers/worksets"
import { ref, toRaw, watch } from "vue"
import { useRoute } from "vue-router"
import { createVuetify } from "vuetify"

const COLUMNS: (keyof WorkSet)[] = ["set_type", "intensity", "rpe", "tempo", "note"]

function deepClone(obj: Array<any>) {
  return JSON.parse(JSON.stringify(obj))
}

defineProps({
  id: String,
})
const route = useRoute()
const work_sets_values = ref<WorkSet[]>([])
const work_sets_columns = ref(COLUMNS)
let clone: WorkSet[] = []
const vuetify = ref(createVuetify())

const connector = new WorkSetConnector()
const request: WorkSetRequest = {
  timeslot_id: Number(route.params.id),
}

connector.post(request).then((work_set) => {
  const v = work_set.map((work_set) => work_set)
  work_sets_values.value = v
  clone = v
})
watch(
  work_sets_values,
  async (newValues) => {
    // TODO: Add debounce function

    const diff_res = {}
    newValues.forEach((v, i) => {
      const clone_v = clone[i]
      for (const key in clone_v) {
        if (v[key] !== clone_v[key]) {
          diff_res[key] = v[key]
          diff_res["id"] = v.id
        }
      }
    })
    console.log(diff_res)
    const request: WorkSetPutRequest = {
      ...diff_res,
    }
    console.log(request)
    connector.put(request)
    // console.log(clone)
    // console.log(newValues)

    clone = deepClone(newValues)
  },
  { deep: true },
)
</script>

<template>
  <h1>Work set</h1>
  <div :class="vuetify.theme.name"></div>
  <table class="custom-table">
    <thead>
      <tr>
        <th v-for="column in work_sets_columns" :key="column">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in work_sets_values" :key="row.id">
        <td v-for="column in work_sets_columns" :key="column">
          <input v-model="row[column]" :size="Math.max(1, String(row[column]).length)" />
        </td>
      </tr>
    </tbody>
  </table>
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
</style>
