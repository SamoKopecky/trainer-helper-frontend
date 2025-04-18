<script setup lang="ts">
import type { AppTimeslot } from "@/types/calendar"
import type { Timeslot } from "@/types/other"
import { capitalizeWords } from "@/utils/user"
import { onMounted } from "vue"
import { computed } from "vue"
import { useTemplateRef, watch, watchEffect } from "vue"
import { ref, type PropType } from "vue"
import { TimeslotService } from "@/services/timeslots"
import { deepClone } from "@/utils/tranformators"
import { useRouter } from "vue-router"

// TODO: Rewrite all events in create:...
const emit = defineEmits([
  "add-exercise",
  "update-title",
  "duplicate-timeslot",
  "create:exercise-type",
])
const timeslotService = new TimeslotService()

const { appTimeslot } = defineProps({
  appTimeslot: {
    type: Object as PropType<AppTimeslot>,
    required: false,
    default: undefined,
  },
  isTrainer: {
    type: Boolean,
    required: true,
  },
})

const router = useRouter()
const nameEditable = ref(false)
const duplicateDialog = ref(false)
const timeslotName = ref<string | unknown>()
const nameInput = useTemplateRef("nameInput")
const duplicateInput = useTemplateRef("duplicateInput")
const duplicateTimeslotId = ref<number | undefined>()
const duplicateTimeslots = ref<Timeslot[]>([])

const computedDuplicateTimeslots = computed(() => {
  return duplicateTimeslots.value.map((timeslot) => {
    const timeslotCopy = deepClone(timeslot)
    const dayString = timeslot.start.toLocaleString("en-US", { weekday: "long" })
    const date = timeslot.start.toLocaleDateString().split("/")
    const userName = capitalizeWords(timeslot.user_name)
    timeslotCopy.name = `${userName} | ${dayString} ${date[1]}-${date[0]} | ${timeslot.name}`
    return timeslotCopy
  })
})

watchEffect(() => {
  if (nameInput.value) {
    nameInput.value.focus()
  }
})

watchEffect(() => {
  if (duplicateInput.value) {
    duplicateInput.value.focus()
  }
})

watch(
  // Fill in input field with old name
  () => appTimeslot,
  () => {
    timeslotName.value = appTimeslot?.name
  },
)

onMounted(() => {
  const request = {
    // TODO: Adjust start_date
    start_date: "2025-01-20T12:00:00Z",
    end_date: "2026-02-28T20:15:00Z",
  }
  timeslotService.get(request).then((res) => (duplicateTimeslots.value = res))
})

function duplicate() {
  duplicateDialog.value = true
}

function submitTitle() {
  nameEditable.value = !nameEditable.value
  if (nameEditable.value === false) {
    emit("update-title", timeslotName.value)
  }
}

function addExercise() {
  emit("add-exercise")
}

function submitDuplicate() {
  duplicateDialog.value = false
  emit("duplicate-timeslot", duplicateTimeslotId.value)
}

function backToCalendar() {
  router.push({ path: "/calendar" })
}

function addNewExerciseType() {
  emit("create:exercise-type")
}
</script>

<template>
  <v-card
    class="mx-auto"
    prepend-icon="mdi-account"
    :title="appTimeslot?.title ?? 'loading...'"
    variant="text"
  >
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="4" class="d-inline-flex align-center">
          <v-text-field
            ref="nameInput"
            v-if="nameEditable"
            v-model="timeslotName"
            type="text"
            variant="plain"
            density="compact"
            hide-details
            @keydown.enter="submitTitle"
          />
          <span v-if="!nameEditable">
            {{ appTimeslot?.name ?? "Title" }}
          </span>
          <v-icon v-if="isTrainer" small class="ml-2" @click="submitTitle">
            {{ nameEditable ? "mdi-check" : "mdi-pencil" }}
          </v-icon>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <slot />
  <v-btn text="Go back" @click="backToCalendar" />
  <v-btn text="Add exercise" @click="addExercise" />
  <v-btn v-if="isTrainer" text="Add exercise type" @click="addNewExerciseType" />
  <v-btn v-if="isTrainer" text="Duplicate from another timeslot" @click="duplicate" />

  <v-dialog v-model="duplicateDialog">
    <v-card title="Duplicate timeslot">
      <v-card-text>
        <v-autocomplete
          ref="duplicateInput"
          v-model="duplicateTimeslotId"
          :items="computedDuplicateTimeslots"
          item-title="name"
          item-value="id"
          hide-details="auto"
          placeholder="Select timelost to duplicate"
          @keydown.enter="submitDuplicate"
        />
        <span>Warning: this will override your current exercises</span>
        <br />
        <v-btn text="Confirm" @click="submitDuplicate"></v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  margin: 1rem 0px 10px 1rem;
}
</style>
