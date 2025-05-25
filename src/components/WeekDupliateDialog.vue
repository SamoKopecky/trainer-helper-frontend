<script setup lang="ts">
import BlocksPanel from "@/components/BlocksPanel.vue"
import NotificationFloat from "@/components/NotificationFloat.vue"
import { useNotifications } from "@/composables/useNotifications"
import { WeekService } from "@/services/week"
import { ref } from "vue"

const weekService = new WeekService()
const active = defineModel<boolean>()
const templateWeekId = ref<number>()
const isDuplicating = ref(false)
const { notifications, addNotification } = useNotifications()
const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  activeWeekId: {
    type: Number,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits(["notfiy:reload"])

function updateWeekId(weekId: number, _start_date: Date) {
  templateWeekId.value = weekId
}

function duplicate() {
  if (!props.activeWeekId || !templateWeekId.value) return
  isDuplicating.value = true
  weekService
    .postDuplicate({
      new_week_id: props.activeWeekId,
      template_week_id: templateWeekId.value,
    })
    .then(() => {
      emit("notfiy:reload")
      active.value = false
    })
    .catch(() => addNotification("Duplcation failed", "error"))
    .finally(() => (isDuplicating.value = false))
}
</script>

<template>
  <v-dialog v-model="active">
    <NotificationFloat :notifications="notifications" />
    <v-card title="Choose week to duplicate from">
      <template #text>
        <BlocksPanel :user-id="userId" :is-editable="false" @update:week-id="updateWeekId" />
        <v-btn @click="duplicate" :loading="isDuplicating">Duplicate selected week</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
