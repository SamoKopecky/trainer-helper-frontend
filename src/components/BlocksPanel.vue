<script setup lang="ts">
import { useNotifications } from "@/composables/useNotifications"
import { useUser } from "@/composables/useUser"
import NotificationFloat from "@/components/NotificationFloat.vue"
import ChangeEventBar from "@/components/ChangeEventBar.vue"
import { BlockService } from "@/services/block"
import type { BlockMap, WeekDay } from "@/types/block"
import { blocksToMap } from "@/utils/tranformators"
import { computed } from "vue"
import { onMounted, ref } from "vue"
import { useChangeEvents } from "@/composables/useChangeEvents"
import { BlockAdd } from "@/changeEvents/user/blockAdd"
import { BlockDelete } from "@/changeEvents/user/blockDelete"
import { WeekAdd } from "@/changeEvents/user/weekAdd"
import { WeekDelete } from "@/changeEvents/user/weekDelete"
import { getDateWeekDayString } from "@/utils/date"
import { WeekDayService } from "@/services/weekDay"
import { useDebounceFn } from "@vueuse/core"
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
const weekDayService = new WeekDayService()

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

const debounceUpdateName = useDebounceFn(
  (weekDay: WeekDay) => weekDayService.put({ id: weekDay.id, name: weekDay.name }),
  1000,
)

watch(generalDayNames, (newNames, oldNames) => {
  if (newNames.length == oldNames.length) return
  alert("general names not not implemented yet")
})

function mondaysOnly(val: unknown): boolean {
  console.log(val)
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

    <div class="mt-2">
      <ChangeEventBar
        :is-undo-active="undoActive"
        :is-redo-active="redoActive"
        @undo="undo"
        @redo="redo"
      />
    </div>

    <div class="mt-2">
      <v-date-input
        v-model="selectedDate"
        variant="outlined"
        label="Start of the week"
        :allowed-dates="mondaysOnly"
      ></v-date-input>
    </div>

    <v-card variant="text">
      <v-card-title class="text-h6 py-2">Training assignments</v-card-title>
      <v-card-text class="pt-2">
        <v-list density="compact" lines="one" class="mb-3 specific-weekdays-list">
          <template v-for="(day, index) in activeWeekDays" :key="day.id">
            <v-list-item class="px-1 py-0 weekday-list-item">
              <v-row align="center" no-gutters class="py-1">
                <v-col
                  cols="12"
                  sm="4"
                  md="3"
                  class="py-0 pr-sm-2 d-flex align-center weekday-name-col"
                >
                  <span class="font-weight-medium text-body-1 ws-nowrap"
                    >{{ getDateWeekDayString(day.day_date) }}
                  </span>
                </v-col>
                <v-col cols="12" sm="8" md="9" class="py-0 weekday-input-col">
                  <v-text-field
                    v-model="day.name"
                    label="Name"
                    placeholder="Name for this day"
                    density="compact"
                    clearable
                    hide-details="auto"
                    variant="outlined"
                    class="compact-text-field"
                    @update:model-value="debounceUpdateName(day)"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
            <v-divider
              v-if="activeWeekDays && index < activeWeekDays.length - 1"
              class="my-1"
            ></v-divider>
          </template>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <h3 class="text-subtitle-1 font-weight-medium mb-2">General Unassigned Training days</h3>
        <p class="text-caption mb-2">Create traning not tied to a specific weekday.</p>
        <v-combobox
          v-model="generalDayNames"
          label="Add days here"
          placeholder="Type and press Enter"
          multiple
          chips
          density="compact"
          :chips-props="{ size: 'x-small', closable: true, class: 'my-1' }"
          hide-details="auto"
          variant="outlined"
          append-icon=""
          class="mb-3"
        ></v-combobox>
      </v-card-text>
    </v-card>

    <!-- Week Days -->
    <!-- Use v-menu here -->
    <!-- <v-date-picker></v-date-picker> -->
  </div>
</template>

<style scoped>
.weekday-list-item {
  min-height: 52px; /* Adjust as needed to ensure proper alignment */
}

.weekday-name-col {
  /* Ensures the day name doesn't wrap too early if space is tight */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.compact-text-field .v-input__control,
.compact-text-field .v-field {
  /* Attempt to reduce the default height of the text field if needed */
  /* This can be tricky with Vuetify's default styling, adjust with caution */
}

/* For very small screens, you might want to stack them again */
@media (max-width: 599.98px) {
  /* Vuetify's 'xs' breakpoint */
  .weekday-name-col {
    padding-bottom: 4px; /* Add some space when stacked */
    text-align: left;
    width: 100%; /* Make sure it takes full width */
  }
  .weekday-input-col {
    width: 100%;
  }
  .v-list-item.weekday-list-item > .v-row {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}

/* Ensure chips don't take too much vertical space */
:deep(.v-chip) {
  margin-top: 3px !important;
  margin-bottom: 3px !important;
}
</style>
