<script setup lang="ts">
import { WorkSetConnector, type WorkSet, type WorkSetRequest } from "@/backend-helpers/worksets"
import { ref } from "vue"
import { useRoute } from "vue-router"

defineProps({
  id: String,
})
const route = useRoute()
const work_sets = ref<WorkSet[]>([])
const connector = new WorkSetConnector()
const request: WorkSetRequest = {
  timeslot_id: Number(route.params.id),
}

connector.post(request).then((work_set) => {
  work_sets.value = work_set.map((work_set) => work_set)
})
</script>

<template>
  <h1>Work set</h1>
  <p v-for="work_set in work_sets">
    {{ work_set }}
  </p>
</template>
