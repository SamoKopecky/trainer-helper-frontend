<script setup lang="ts">
import { MediaType, type ExerciseType } from "@/types/other"
import { useDebounceFn } from "@vueuse/core"
import { computed, type PropType } from "vue"
import YoutubeEmbed from "./YoutubeEmbed.vue"
import { extractYouTubeId } from "@/utils/other"
import { ref } from "vue"
import type { ExerciseTypePostRequest } from "@/services/exerciseType"

const { modelValue, exerciseType, isNew } = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  exerciseType: {
    type: Object as PropType<ExerciseType | undefined>,
    required: false,
    default: null,
  },
  isNew: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(["update:modelValue", "update:exerciseType", "create:exerciseType"])

// Refs
// TODO: NOW! when adding new exercise type, the note and link are not being savedduring editing and
// even on post request
const exerciseTypeLocalRef = computed(() => {
  return exerciseType
})
const youtubeVideoIdRef = computed(() => {
  if (exerciseType && exerciseType.media_address) {
    return extractYouTubeId(exerciseType?.media_address)
  }
  return null
})
const newNameRef = ref<string>("")
const noteRef = computed({
  get() {
    return exerciseType?.note || ""
  },
  set(newNote: string) {
    if (exerciseTypeLocalRef.value) {
      exerciseTypeLocalRef.value.note = newNote
      debouncedEmitUpdate()
    }
  },
})
const mediaTypeRef = computed({
  get() {
    return exerciseType?.media_type || MediaType.Youtube
  },
  set(newSourceType: string) {
    if (exerciseTypeLocalRef.value) {
      exerciseTypeLocalRef.value.media_type = MediaType[newSourceType]
      emitUpdate()
    }
  },
})
const youtubeLinkRef = computed({
  get() {
    return exerciseType?.media_address ?? ""
  },
  set(newLink: string) {
    if (exerciseTypeLocalRef.value) {
      exerciseTypeLocalRef.value.media_address = newLink
      emitUpdate()
    }
  },
})

// Functions
const debouncedEmitUpdate = useDebounceFn(() => emitUpdate(), 1000)
function exitButton() {
  emit("update:modelValue", false)
}

function saveButton() {
  if (isNew && newNameRef.value !== "") {
    emit("create:exerciseType", {
      note: noteRef.value,
      name: newNameRef.value,
      // TODO: Work with files also
      media_address: youtubeLinkRef.value,
      media_type: mediaTypeRef.value,
    } as ExerciseTypePostRequest)
    newNameRef.value = ""
  }
  emitUpdate()
}

function emitUpdate() {
  if (!isNew) {
    emit("update:exerciseType", exerciseTypeLocalRef.value)
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="exitButton">
    <v-card>
      <!-- title -->
      <v-card-title>
        <div v-if="!isNew">
          {{ exerciseType?.name }}
        </div>
        <v-text-field
          v-else
          v-model="newNameRef"
          type="text"
          variant="plain"
          density="compact"
          placeholder="Enter exercise type name"
          hide-details
        />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <!-- Note  -->
        <v-textarea
          label="Exercise Notes"
          variant="outlined"
          rows="4"
          auto-grow
          clearable
          v-model="noteRef"
          placeholder="Enter any notes for this exercise type..."
        ></v-textarea>

        <v-divider class="mb-4"></v-divider>
        <label class="v-label mb-2 d-block">Exercise Video Source</label>
        <v-btn-toggle
          v-model="mediaTypeRef"
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
        <div v-if="mediaTypeRef === MediaType.Youtube">
          <v-text-field
            label="YouTube Link"
            variant="outlined"
            v-model="youtubeLinkRef"
            clearable
            placeholder="Paste YouTube video URL..."
            prepend-inner-icon="mdi-youtube"
          ></v-text-field>

          <v-container>
            <v-row justify="center">
              <!-- Smaller on bigger screen -->
              <v-col cols="12" lg="6">
                <YoutubeEmbed v-if="youtubeVideoIdRef !== null" :video-id="youtubeVideoIdRef" />
              </v-col>
            </v-row>
          </v-container>
        </div>

        <v-file-input
          v-if="mediaTypeRef === MediaType.File"
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
        <v-btn color="grey-darken-1" variant="text" @click="exitButton">Exit</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveButton">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
