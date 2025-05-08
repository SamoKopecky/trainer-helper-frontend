<script setup lang="ts">
import { useNotifications } from "@/composables/useNotifications"
import { useUser } from "@/composables/useUser"
import NotificationFloat from "@/components/NotificationFloat.vue"
import { BlockService } from "@/services/block"
import { WeekService } from "@/services/week"
import type { BlockMap } from "@/types/block"
import { getMaxLabel } from "@/utils/blockView"
import { blocksToMap, blockToBlockValue } from "@/utils/tranformators"
import { computed } from "vue"
import { onMounted, ref } from "vue"

const { userId } = defineProps({
  userId: {
    type: String,
    required: true,
  },
})

const { isTrainer } = useUser()
const { notifications, addNotification } = useNotifications()
const blockService = new BlockService()
const weekService = new WeekService()
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
  blockService
    .post({ user_id: userId, label: getMaxLabel(activeBlocks.value) + 1 })
    .then((res) => activeBlocks.value.set(res.id, blockToBlockValue(res)))
}

function deleteBlock() {
  const values = Array.from(activeBlocks.value.values())
  const lastId = values[values.length - 1].id

  blockService.delete(lastId).then(() => activeBlocks.value.delete(lastId))
}

function addWeek() {
  if (!activeWeeks.value) {
    addNotification("No week selected", "info")
    return
  }

  const maxLabel = getMaxLabel(activeWeeks.value)
  weekService
    .post({
      label: maxLabel + 1,
      block_id: activeBlockId.value,
      start_date: new Date(),
    })
    .then((res) => activeWeeks.value?.set(res.id, res))
}

function deleteWeek() {
  if (!activeWeeks.value) {
    addNotification("No block selected", "info")
    return
  }

  const valuesArray = Array.from(activeWeeks.value?.values())
  const lastId = valuesArray[valuesArray.length - 1].id
  weekService.delete(lastId).then(() => activeWeeks.value?.delete(lastId))
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

    <!-- Week Days -->
    <!-- Use v-menu here -->
    <!-- <v-date-picker></v-date-picker> -->
  </div>
</template>
