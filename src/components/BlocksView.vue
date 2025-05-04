<script setup lang="ts">
import { BlockService } from "@/services/block"
import { WeekService } from "@/services/week"
import type { BlockMap } from "@/types/block"
import { blocksToMap } from "@/utils/tranformators"
import { onMounted, ref } from "vue"

const { userId } = defineProps({
  userId: {
    type: String,
    required: true,
  },
})

const blockService = new BlockService()
const weekService = new WeekService()
const blocksMap = ref<BlockMap>()
// TODO: Set default depedning on todays date after we get blocks data
const blockRef = ref<number>(1)
const weekRef = ref<number>(1)

onMounted(() => blockService.get(userId).then((res) => (blocksMap.value = blocksToMap(res))))
</script>

<template>
  <div>
    <!-- Blocks -->
    <span class="text-subtitle-1 font-weight-medium"> Block </span>
    <v-spacer />
    <v-btn-toggle mandatory variant="outlined" divided v-model="blockRef">
      <v-btn
        size="large"
        v-for="block in blocksMap?.values()"
        :key="block.id"
        :text="block.label.toString()"
        :value="block.id"
      />
    </v-btn-toggle>
    <v-btn icon="mdi-plus" class="ml-2" size="small"></v-btn>
    <v-btn icon="mdi-minus" class="ml-2" size="small"></v-btn>

    <v-spacer />

    <!-- Weeks -->
    <span class="text-subtitle-1 font-weight-medium"> Week </span>
    <v-spacer />

    <v-btn-toggle mandatory variant="outlined" divided v-model="weekRef">
      <v-btn
        size="large"
        v-for="week in blocksMap?.get(blockRef!)?.weeks.values()"
        :key="week.id"
        :text="week.label.toString()"
        :value="week.id"
      />
    </v-btn-toggle>
    <v-btn icon="mdi-plus" class="ml-2" size="small"></v-btn>
    <v-btn icon="mdi-minus" class="ml-2" size="small"></v-btn>

    <v-spacer />

    <!-- Week Days -->
    <!-- Use v-menu here -->
    <v-date-picker></v-date-picker>
  </div>
</template>
