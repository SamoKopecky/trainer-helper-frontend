<script setup lang="ts">
import { useNotifications } from "@/composables/useNotifications"
import { useUser } from "@/composables/useUser"
import NotificationFloat from "@/components/NotificationFloat.vue"
import ChangeEventBar from "@/components/ChangeEventBar.vue"
import { BlockService } from "@/services/block"
import type { BlockMap } from "@/types/block"
import { blocksToMap } from "@/utils/tranformators"
import { computed } from "vue"
import { onMounted, ref } from "vue"
import { useChangeEvents } from "@/composables/useChangeEvents"
import { BlockAdd } from "@/changeEvents/user/blockAdd"
import { BlockDelete } from "@/changeEvents/user/blockDelete"
import { WeekAdd } from "@/changeEvents/user/weekAdd"
import { WeekDelete } from "@/changeEvents/user/weekDelete"

const { userId } = defineProps({
  userId: {
    type: String,
    required: true,
  },
})

const { isTrainer } = useUser()
const { notifications, addNotification } = useNotifications()
const { addChangeEvent, redo, undo, redoActive, undoActive } = useChangeEvents(addNotification)
const blockService = new BlockService()
const activeBlocks = ref<BlockMap>(new Map())
const activeBlockId = ref<number>(0)
const activeWeekId = ref<number>(0)
const activeWeeks = computed(() => activeBlocks.value.get(activeBlockId.value)?.weeks)

onMounted(() =>
  blockService.get(userId).then((res) => {
    activeBlocks.value = blocksToMap(res)
    // TODO: Set default depedning on todays date
    const firstBlock = activeBlocks.value.values().next()
    if (firstBlock.value) {
      activeBlockId.value = firstBlock.value.id
      const firstWeek = firstBlock.value.weeks.values().next()
      if (firstWeek.value) {
        activeWeekId.value = firstWeek.value.id
      }
    }
  }),
)

function addBlock() {
  addChangeEvent(new BlockAdd(activeBlocks.value, userId))
}

function deleteBlock() {
  addChangeEvent(new BlockDelete(activeBlocks.value))
}

function addWeek() {
  if (!activeWeeks.value) {
    addNotification("No week selected", "info")
    return
  }
  addChangeEvent(new WeekAdd(activeWeeks.value, userId, activeBlockId.value))
}

function deleteWeek() {
  if (!activeWeeks.value) {
    addNotification("No block selected", "info")
    return
  }

  addChangeEvent(new WeekDelete(activeWeeks.value))
}
</script>

<template>
  <div>
    <NotificationFloat :notifications="notifications" />
    <ChangeEventBar
      :is-undo-active="undoActive"
      :is-redo-active="redoActive"
      @undo="undo"
      @redo="redo"
    />
    <!-- Blocks -->
    <span class="text-subtitle-1 font-weight-medium"> Block </span>
    <v-spacer />
    <v-btn-toggle mandatory variant="outlined" divided v-model="activeBlockId">
      <v-btn
        size="large"
        v-for="block in activeBlocks.values()"
        :key="block.id"
        :text="block.label.toString()"
        :value="block.id"
      />
    </v-btn-toggle>
    <span v-if="isTrainer">
      <v-btn icon="mdi-plus" class="ml-2" size="small" @click="addBlock"></v-btn>
      <v-btn icon="mdi-minus" class="ml-2" size="small" @click="deleteBlock"></v-btn>
    </span>

    <v-spacer />

    <!-- Weeks -->
    <span class="text-subtitle-1 font-weight-medium"> Week </span>
    <v-spacer />

    <v-btn-toggle mandatory variant="outlined" divided v-model="activeWeekId">
      <v-btn
        size="large"
        v-for="week in activeWeeks?.values()"
        :key="week.id"
        :text="week.label.toString()"
        :value="week.id"
      />
    </v-btn-toggle>
    <span v-if="isTrainer">
      <v-btn icon="mdi-plus" class="ml-2" size="small" @click="addWeek"></v-btn>
      <v-btn icon="mdi-minus" class="ml-2" size="small" @click="deleteWeek"></v-btn>
    </span>

    <v-spacer />

    <!-- Week Days -->
    <!-- Use v-menu here -->
    <!-- <v-date-picker></v-date-picker> -->
  </div>
</template>
