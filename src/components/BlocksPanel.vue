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
import { watch } from "vue"

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

const selectedDate = ref<Date>()

const activeBlockId = ref<number>()
const activeWeekId = ref<number>()

const activeBlocks = ref<BlockMap>(new Map())
const activeWeeks = computed(() => {
  if (!activeBlockId.value) return
  let activeBlockIdLocal = activeBlockId.value
  const blocks = Array.from(activeBlocks.value?.values())
  if (blocks.length == 1) {
    activeBlockIdLocal = blocks[0].id
  }
  return activeBlocks.value.get(activeBlockIdLocal)?.weeks
})

// Emit this
const activeWeekDays = computed(() => {
  if (!activeWeekId.value) return
  return activeWeeks.value?.get(activeWeekId.value)?.week_days
})

watch(activeWeekId, (newWeekId) => {
  if (!newWeekId) return
  selectedDate.value = activeWeeks.value?.get(newWeekId)?.start_date
})

const generalDayNames = ref<string[]>([])

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
  if (!activeWeeks.value || !activeBlockId.value) {
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

watch(generalDayNames, (newNames, oldNames) => {
  if (newNames.length == oldNames.length) return
  alert("general names not not implemented yet")
})

function mondaysOnly(val: unknown): boolean {
  const date = new Date(val as string)
  return date.getDay() === 1
}
</script>

<template>
  <div>
    <NotificationFloat :notifications="notifications" />
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

    <div class="mt-2" v-if="isTrainer">
      <ChangeEventBar
        :is-undo-active="undoActive"
        :is-redo-active="redoActive"
        @undo="undo"
        @redo="redo"
      />
    </div>

    <!-- TODO: Add date update -->
    <div class="mt-4">
      <v-date-input
        :readonly="!isTrainer"
        v-model="selectedDate"
        variant="outlined"
        label="Start of the week"
        :allowed-dates="mondaysOnly"
      ></v-date-input>
    </div>
  </div>
</template>
