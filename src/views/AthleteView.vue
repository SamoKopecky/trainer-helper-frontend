<script setup lang="ts">
import BlocksPanel from "@/components/BlocksPanel.vue"
import { useRouter } from "vue-router"

defineProps({
  id: {
    type: String,
    required: false,
    default: "",
  },
})

const router = useRouter()

function goToAthlete(userId: string) {
  router.push({ path: `/athlete/${userId}` })
}
</script>

<template>
  <v-card :title="'User name/nickname'" flat>
    <template #title>
      <!-- <v-autocomplete -->
      <!--   ref="input" -->
      <!--   v-model="selectedId" -->
      <!--   :items="users" -->
      <!--   :item-title="getUserDisplaytitle" -->
      <!--   item-value="id" -->
      <!--   placeholder="Enter name" -->
      <!--   variant="plain" -->
      <!--   density="compact" -->
      <!--   hide-details="auto" -->
      <!-- /> -->
    </template>
    <template #text>
      <div v-if="id">
        <BlocksPanel :user-id="id" />
      </div>

      <div v-else>
        <v-btn @click="goToAthlete('4de8189c-e8cb-4b8f-9ff7-ee673fc956c9')"> Go to user X </v-btn>
      </div>
    </template>
  </v-card>
</template>
