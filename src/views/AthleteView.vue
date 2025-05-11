<script setup lang="ts">
import BlocksPanel from "@/components/BlocksPanel.vue"
import { useUsers } from "@/composables/useUsers"
import { watch } from "vue"
import { ref } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
})

const selectedUserId = ref<string>()
const router = useRouter()
const { users, userDisplay } = useUsers()

watch(
  () => props.id,
  () => {
    selectedUserId.value = undefined
    if (props.id) {
      selectedUserId.value = props.id
    }
  },
  { immediate: true },
)

function goToAthlete(userId: string) {
  router.push({ path: `/athlete/${userId}` })
}
</script>

<template>
  <v-card :title="'User name/nickname'" flat>
    <template #title>
      <v-autocomplete
        v-model="selectedUserId"
        :items="users"
        :item-title="userDisplay"
        item-value="id"
        placeholder="Enter name"
        variant="plain"
        density="compact"
        hide-details="auto"
        @update:model-value="goToAthlete"
      >
        <template #selection="{ item }">
          <span class="text-h5 font-weight-medium">
            {{ userDisplay(item.raw) }}
          </span></template
        >
      </v-autocomplete>
    </template>
    <template #text>
      <v-divider />
      <div v-if="id">
        <BlocksPanel :user-id="id" />
      </div>

      <div v-else>Choose a user above</div>
    </template>
  </v-card>
</template>
