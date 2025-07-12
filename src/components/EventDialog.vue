<script setup lang="ts">
import type { DisplayTimeslot } from "@/types/calendar"
import { useRouter } from "vue-router"
import { ref, watch } from "vue"
import { formatDate } from "@/utils/date"
import { useUsers } from "@/composables/useUsers"
import { WeekDayService } from "@/services/weekDay"
import { getISODateString } from "@/utils/date"
import { type WeekDay } from "@/types/block"
import { useUser } from "@/composables/useUser"
import { computed } from "vue"
import { timeslotToDisplayTimeslot } from "@/utils/tranformators"
import { TimeslotService } from "@/services/timeslots"

const weekDayService = new WeekDayService()
const timeslotService = new TimeslotService()

const emit = defineEmits(["delete-cal-timeslot"])

const timeslot = defineModel<DisplayTimeslot>("timeslot")
const active = defineModel<boolean>("active")
const { isTrainer } = useUser()
const { users, userDisplay } = useUsers()
const router = useRouter()

const userModel = ref<string>()
const weekDayMatch = ref<WeekDay>()
const hasWeekDay = computed(() => timeslot.value && timeslot.value.week_day)
const isAssinged = computed(() => timeslot.value && timeslot.value.user)
const isWeekDayAvailable = computed(() => weekDayMatch.value)

// When switching which event is viewed, always find a new match
watch(active, (newValue) => {
  if (timeslot.value && timeslot.value.user) userModel.value = timeslot.value?.user?.id

  if (newValue && !timeslot.value?.week_day) findMatch()
})

function redirectExercise(timeslot: DisplayTimeslot | undefined) {
  if (!timeslot) return

  const basePath = "/weekDay"
  if (timeslot.week_day) {
    router.push({ path: `${basePath}/${timeslot.week_day.id}` })
  } else {
    router.push({ path: basePath })
  }
}

function redirectAthlete() {
  router.push({ path: `/athlete/${timeslot.value?.user?.id}` })
}

function deleteCalTimeslot(event: DisplayTimeslot | undefined) {
  emit("delete-cal-timeslot", event)
}

function updateUser() {
  const newUser = users.value?.find((p) => p.id === userModel.value)
  if (!newUser || !timeslot.value) return

  timeslotService.put({ id: timeslot.value.id, trainee_id: newUser.id }).then(() => {
    timeslot.value!.trainee_id = newUser.id
    timeslot.value!.user = newUser
    timeslot.value = timeslotToDisplayTimeslot(timeslot.value!, false)
    // When user changes, always unassing and find new
    unassignWeekDay()
  })
}

function eventMoved() {
  // On event move unassing
  unassignWeekDay()
}

function assignWeekDay() {
  if (!weekDayMatch.value || !timeslot.value) return
  weekDayService
    .put({
      id: weekDayMatch.value.id,
      timeslot_id: timeslot.value.id,
    })
    .then(() => {
      timeslot.value!.week_day = weekDayMatch.value
      timeslot.value = timeslotToDisplayTimeslot(timeslot.value!, false)
    })
}

function findMatch() {
  if (!timeslot.value) return
  weekDayService
    .getMany({
      user_id: timeslot.value.user?.id,
      day_date: getISODateString(timeslot.value.start),
    })
    .then((res) => {
      if (res.length == 0) {
        weekDayMatch.value = undefined
      }
      weekDayMatch.value = res[0]
    })
}

function unassignWeekDay() {
  // If unassingned always find new even if there was no session assinged
  // before
  findMatch()
  if (!timeslot.value || !timeslot.value.week_day) {
    return
  }
  weekDayService.deleteTimeslot(timeslot.value.week_day.id).then(() => {
    timeslot.value!.week_day = undefined
    timeslot.value = timeslotToDisplayTimeslot(timeslot.value!, false)
  })
}

defineExpose({
  eventMoved,
})
</script>

<template>
  <v-dialog v-model="active" max-width="500px">
    <v-card>
      <v-card-title>
        <v-autocomplete
          v-model="userModel"
          :readonly="!isTrainer"
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
        <v-btn
          v-if="hasWeekDay"
          class="mr-2"
          text="to session"
          @click="redirectExercise(timeslot)"
        />
        <span v-if="isTrainer">
          <v-btn v-if="isAssinged" class="mr-2" text="to athlete" @click="redirectAthlete" />
          <v-btn text="Delete timeslot" @click="deleteCalTimeslot(timeslot)" />
        </span>

        <v-spacer />

        <div v-if="isTrainer">
          <div v-if="!isAssinged" class="mt-2 text-caption text-grey">
            Athlete not assinged, to match a session assing an athlete
          </div>

          <div v-else>
            <div v-if="hasWeekDay" class="mt-2 d-flex align-center">
              Session {{ timeslot!.week_day?.name }} assinged at
              {{ formatDate(timeslot!.week_day!.day_date) }}
              <v-btn
                icon="mdi-close-circle"
                variant="text"
                density="compact"
                v-tooltip:bottom="'Unassing'"
                color="error"
                @click="unassignWeekDay"
                class="ml-1"
              />
            </div>

            <div v-else class="mt-3">
              <v-btn
                text="Assign"
                :disabled="!isWeekDayAvailable"
                :color="isWeekDayAvailable ? 'green' : ''"
                @click="assignWeekDay"
              />

              <div v-if="isWeekDayAvailable" class="mt-2 text-green d-flex align-center">
                <v-icon color="green" class="mr-1">mdi-check-circle</v-icon>
                <span
                  >Session found {{ weekDayMatch!.name }} at
                  {{ formatDate(weekDayMatch!.day_date) }}</span
                >
              </div>

              <div v-else-if="!isWeekDayAvailable" class="mt-2 text-caption text-grey">
                Session not found, go to athelte overview and create a new week day
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!hasWeekDay">Not assingned yet</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
