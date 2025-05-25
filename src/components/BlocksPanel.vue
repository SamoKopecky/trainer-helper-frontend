<script setup lang="ts">
import { useNotifications } from "@/composables/useNotifications"
import NotificationFloat from "@/components/NotificationFloat.vue"
import ChangeEventBar from "@/components/ChangeEventBar.vue"
import { BlockService } from "@/services/block"
import type { BlockMap, Week } from "@/types/block"
import { blocksToMap } from "@/utils/tranformators"
import { ref } from "vue"
import { useChangeEvents } from "@/composables/useChangeEvents"
import { BlockAdd } from "@/changeEvents/user/blockAdd"
import { BlockDelete } from "@/changeEvents/user/blockDelete"
import { WeekAdd } from "@/changeEvents/user/weekAdd"
import { WeekDelete } from "@/changeEvents/user/weekDelete"
import { watch } from "vue"
import { WeekService } from "@/services/week"
import { getClosestWeek, getISODateString } from "@/utils/date"

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  isEditable: {
    type: Boolean,
    required: true,
  },
})

const { notifications, addNotification } = useNotifications()
const { addChangeEvent, redo, undo, redoActive, undoActive } = useChangeEvents(addNotification)

const emit = defineEmits(["update:week-id", "update:start-date"])

const blockService = new BlockService()
const weekService = new WeekService()

const selectedDate = ref<Date>()

const activeBlockId = ref<number>()
const activeWeekId = ref<number>()

const activeBlocks = ref<BlockMap>(new Map())
const activeWeeks = ref<Map<number, Week>>(new Map())

watch(activeBlockId, (newBlockId) => {
  if (!newBlockId) return
  const weeks = activeBlocks.value.get(newBlockId)?.weeks
  if (!weeks) return
  activeWeeks.value = weeks
  if (weeks.size == 0) return
  activeWeekId.value = getClosestWeek(Array.from(weeks.values())).id
})

watch(activeWeekId, (newWeekId) => {
  if (!newWeekId) return
  const activeWeek = activeWeeks.value?.get(newWeekId)
  selectedDate.value = activeWeek?.start_date
  emit("update:week-id", newWeekId, activeWeek?.start_date)
})

watch(
  () => props.userId,
  (newUserId) =>
    blockService.get(newUserId).then((res) => {
      if (res.length == 0) {
        activeBlocks.value = new Map()
        activeWeeks.value = new Map()
        activeWeekId.value = undefined
        activeBlockId.value = undefined
      }
      activeBlocks.value = blocksToMap(res)
      weekService
        .getFiltered({
          start_date: getISODateString(new Date()),
          user_id: props.userId,
        })
        .then((res) => {
          if (!res) return
          activeBlockId.value = res.block_id
          activeWeekId.value = res.id
        })
    }),
  { immediate: true },
)

function addBlock() {
  addChangeEvent(new BlockAdd(activeBlocks.value, props.userId))
}

function deleteBlock() {
  addChangeEvent(new BlockDelete(activeBlocks.value))
}

function addWeek() {
  if (!activeWeeks.value || !activeBlockId.value) {
    addNotification("No week selected", "info")
    return
  }
  addChangeEvent(new WeekAdd(activeWeeks.value, props.userId, activeBlockId.value))
}

function deleteWeek() {
  if (!activeWeeks.value) {
    addNotification("No block selected", "info")
    return
  }

  addChangeEvent(new WeekDelete(activeWeeks.value))
}

function mondaysOnly(val: unknown): boolean {
  const date = new Date(val as string)
  return date.getDay() === 1
}

function changeStartOfTheWeek() {
  if (!activeWeekId.value || !selectedDate.value) return
  weekService
    .put({
      start_date: getISODateString(selectedDate.value),
      id: activeWeekId.value,
    })
    .then(() => {
      const activeWeek = activeWeeks.value.get(activeWeekId.value!)
      const date = selectedDate.value
      if (!date || !activeWeek) return
      activeWeek.start_date = date
      emit("update:start-date", date)
    })
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
    <span v-if="isEditable">
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
    <span v-if="isEditable">
      <v-btn icon="mdi-plus" class="ml-2" size="small" @click="addWeek"></v-btn>
      <v-btn icon="mdi-minus" class="ml-2" size="small" @click="deleteWeek"></v-btn>
    </span>

    <v-spacer />

    <ChangeEventBar
      class="mt-2"
      justify="start"
      :is-undo-active="undoActive"
      :is-redo-active="redoActive"
      @undo="undo"
      @redo="redo"
    />

    <div class="mt-4">
      <v-date-input
        :disabled="!activeWeekId"
        :readonly="!isEditable"
        v-model="selectedDate"
        variant="outlined"
        label="Start of the week"
        :allowed-dates="mondaysOnly"
        @update:model-value="changeStartOfTheWeek"
      ></v-date-input>
    </div>
  </div>
</template>
