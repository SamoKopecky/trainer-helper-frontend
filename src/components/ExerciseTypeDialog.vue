<script setup lang="ts">
import { MediaType, type ExerciseType } from "@/types/other"
import { useDebounceFn } from "@vueuse/core"
import { computed, type PropType } from "vue"
import YoutubeEmbed from "./YoutubeEmbed.vue"
import { extractYouTubeId } from "@/utils/other"

const { modelValue, exerciseType } = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  exerciseType: {
    type: Object as PropType<ExerciseType | undefined>,
    required: false,
    default: null,
  },
})

const exerciseTypeRef = computed(() => {
  return exerciseType
})
const youtubeVideoId = computed(() => {
  if (exerciseType && exerciseType.media_address) {
    return extractYouTubeId(exerciseType?.media_address)
  }
  return null
})
const emit = defineEmits(["update:modelValue", "update:exerciseType"])
const debouncedEmitUpdate = useDebounceFn(() => emitUpdate(), 1000)
const noteModel = computed({
  get() {
    return exerciseType?.note || ""
  },
  set(newNote: string) {
    if (exerciseTypeRef.value) {
      exerciseTypeRef.value.note = newNote
      debouncedEmitUpdate()
    }
  },
})
const videoSourceType = computed({
  get() {
    return exerciseType?.media_type || MediaType.Youtube
  },
  set(newSourceType: string) {
    if (exerciseTypeRef.value) {
      exerciseTypeRef.value.media_type = MediaType[newSourceType]
      emitUpdate()
    }
  },
})
const youtubeLink = computed({
  get() {
    return exerciseType?.media_address ?? ""
  },
  set(newLink: string) {
    if (exerciseTypeRef.value) {
      exerciseTypeRef.value.media_address = newLink
      emitUpdate()
    }
  },
})

// Functions
function closeDialog() {
  emit("update:modelValue", false)
}

function emitUpdate() {
  emit("update:exerciseType", exerciseTypeRef.value)
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog">
    <v-card>
      <!-- title -->
      <v-card-title>{{ exerciseType?.name }}</v-card-title>
      <v-divider />
      <v-card-text>
        <v-textarea
          label="Exercise Notes"
          variant="outlined"
          rows="4"
          auto-grow
          clearable
          v-model="noteModel"
          placeholder="Enter any notes for this exercise type..."
        ></v-textarea>

        <v-divider class="mb-4"></v-divider>
        <label class="v-label mb-2 d-block">Exercise Video Source</label>
        <v-btn-toggle
          v-model="videoSourceType"
          mandatory
          variant="outlined"
          density="compact"
          divided
          class="mb-4 d-flex"
        >
          <v-btn value="YOUTUBE" class="flex-grow-1">
            <v-icon start>mdi-link</v-icon>
            YouTube Link
          </v-btn>
          <v-btn value="FILE" class="flex-grow-1">
            <v-icon start>mdi-upload</v-icon>
            Upload File
          </v-btn>
        </v-btn-toggle>
        <div v-if="videoSourceType === MediaType.Youtube">
          <v-text-field
            label="YouTube Link"
            variant="outlined"
            v-model="youtubeLink"
            clearable
            placeholder="Paste YouTube video URL..."
            prepend-inner-icon="mdi-youtube"
          ></v-text-field>

          <v-container>
            <v-row justify="center">
              <!-- Smaller on bigger screen -->
              <v-col cols="12" lg="6">
                <YoutubeEmbed v-if="youtubeVideoId !== null" :video-id="youtubeVideoId" />
              </v-col>
            </v-row>
          </v-container>
        </div>

        <v-file-input
          v-if="videoSourceType === MediaType.File"
          label="Select Video File"
          variant="outlined"
          show-size
          accept="video/*"
          placeholder="Choose a video file to upload"
          prepend-icon=""
          prepend-inner-icon="mdi-video"
          clearable
          hint="Not yet implemented"
          persistent-hint
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Exit</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="emitUpdate">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
