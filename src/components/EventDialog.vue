<script setup lang="ts">
import type { CalTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { ref, watch } from "vue"
import { useUsers } from "@/composables/useUsers"
import { WeekDayService } from "@/services/weekDay"
import { getISODateString } from "@/utils/date"
import { type WeekDay } from "@/types/block"
import { useUser } from "@/composables/useUser"
import { computed } from "vue"

const weekDayService = new WeekDayService()

const emit = defineEmits(["delete-cal-timeslot", "update:modelValue", "update-user"])

const timeslot = defineModel<CalTimeslot>("timeslot")
const active = defineModel<boolean>("active")
const { isTrainer } = useUser()
const { users, userDisplay } = useUsers()
const router = useRouter()

const timeslotUserId = ref<string>()
const weekDayMatch = ref<WeekDay>()
const hasWeekDay = computed(() => timeslot.value && timeslot.value.week_day)
const isAssinged = computed(() => timeslot.value && timeslot.value.user)
const isWeekDayAvailable = computed(() => weekDayMatch.value)

function redirectExercise(timeslot: CalTimeslot | undefined) {
  if (!timeslot) return

  const basePath = "/weekDay"
  if (timeslot.week_day) {
    router.push({ path: `${basePath}/${timeslot.week_day.id}` })
  } else {
    router.push({ path: basePath })
  }
}

function deleteCalTimeslot(event: CalTimeslot | undefined) {
  emit("delete-cal-timeslot", event)
}

// FIXME: Why sent events, just update the user here :)
function updateUser() {
  emit(
    "update-user",
    users.value?.find((p) => p.id === timeslotUserId.value),
  )
  unassingWeekDay()
}

// Watch on timeslot change and the change of start value
watch([timeslot, () => timeslot.value?.start], () => {
  weekDayMatch.value = undefined

  if (!timeslot.value || !timeslot.value.user) {
    timeslotUserId.value = undefined
    return
  } else {
    timeslotUserId.value = timeslot.value.user.id
  }

  if (!timeslot.value.week_day) findMatch()
})

function findMatch() {
  if (!timeslot.value) return
  weekDayService
    .get({
      user_id: timeslotUserId.value,
      day_date: getISODateString(timeslot.value.start),
    })
    .then((res) => {
      if (res.length == 0) {
        weekDayMatch.value = undefined
      }
      weekDayMatch.value = res[0]
    })
}

function assignWeekDay() {
  if (!weekDayMatch.value || !timeslot.value) return
  weekDayService
    .put({
      id: weekDayMatch.value.id,
      timeslot_id: timeslot.value.id,
    })
    .then(() => (timeslot.value!.week_day = weekDayMatch.value))
}

function unassingWeekDay() {
  findMatch()
  if (!timeslot.value || !timeslot.value.week_day) return
  weekDayService.deleteTimeslot(timeslot.value.week_day.id).then(() => {
    timeslot.value!.week_day = undefined
  })
}
</script>

<template>
  <v-dialog v-model="active">
    <v-card>
      <v-card-title>
        <v-autocomplete
          v-model="timeslotUserId"
          :items="users"
          :item-title="userDisplay"
          item-value="id"
          placeholder="Asign athlete..."
          variant="plain"
          density="compact"
          hide-details="auto"
          @update:model-value="updateUser"
        />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-btn class="mr-2" text="Go to exercises" @click="redirectExercise(timeslot)" />
        <v-btn v-if="isTrainer" text="Delete timeslot" @click="deleteCalTimeslot(timeslot)" />
        <v-spacer />

        <div v-if="!isAssinged" class="mt-2 text-caption text-grey">
          User not assinged, to match week day assing a user
        </div>
        <div v-else>
          <div v-if="hasWeekDay" class="mt-3 text-caption">
            Week day assinged {{ timeslot!.week_day!.name }} at
            {{ timeslot!.week_day!.day_date.toLocaleDateString() }}
            <v-btn
              icon="mdi-close-circle"
              variant="text"
              size="small"
              v-tooltip:bottom="'Unassing'"
              color="error"
              @click="unassingWeekDay"
            />
          </div>

          <div v-else class="mt-3">
            <v-btn
              text="Assign"
              :disabled="!isWeekDayAvailable"
              :color="isWeekDayAvailable ? 'green' : ''"
              @click="assignWeekDay"
            />

            <div v-if="isWeekDayAvailable" class="mt-2 text-green text-caption">
              <v-icon color="green ">mdi-check-circle</v-icon>
              Week day found! {{ weekDayMatch!.name }} at
              {{ weekDayMatch!.day_date.toLocaleDateString() }}
            </div>

            <div v-else-if="!isWeekDayAvailable" class="mt-2 text-caption text-grey">
              Week day not found, go to athelte overview and create a new week day
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
