<script setup lang="ts">
import { MediaType, type ExerciseType, type ExerciseTypeUpdate } from "@/types/exerciseType"
import { watchDebounced } from "@vueuse/core"
import { computed, type PropType, useTemplateRef } from "vue"
import { useNotificationStore } from "@/stores/useNotificationStore"
import YoutubeEmbed from "./YoutubeEmbed.vue"
import { extractYouTubeId } from "@/utils/other"
import { ref } from "vue"
import { ExerciseTypeService, type ExerciseTypePostRequest } from "@/services/exerciseType"
import { watch } from "vue"
import { watchEffect } from "vue"
import { isArray } from "@/utils/service"

const active = defineModel<boolean>()

const { exerciseType, isNew } = defineProps({
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

const exerciseTypeService = new ExerciseTypeService()

const emit = defineEmits(["update:modelValue", "update:exerciseType", "create:exerciseType"])

// Refs
const noteRef = ref<string>()
const mediaTypeRef = ref<MediaType>()
const youtubeLinkRef = ref<string>()
const newNameRef = ref<string>()
const fileRef = ref<File>()
const fileNameRef = ref<string>()
const mediaBlobUrl = ref<string>()
const mediaBlobType = ref<string>()
const mediaBlobLoading = ref<boolean>()
const fileUploadLoading = ref<boolean>()

const newNameInput = useTemplateRef("input")
const uplodFileInput = useTemplateRef("file-upload-input")
const { addNotification } = useNotificationStore()

const youtubeVideoIdRef = computed(() => {
  if (exerciseType && exerciseType.youtube_link) {
    return extractYouTubeId(exerciseType?.youtube_link)
  }
  return null
})

// Watches
watchEffect(() => {
  if (isNew && newNameInput.value) {
    newNameInput.value.focus()
  }
})
watch(
  () => isNew,
  () => {
    if (isNew) {
      noteRef.value = ""
      youtubeLinkRef.value = ""
      mediaTypeRef.value = MediaType.Youtube
    }
  },
)
watch(
  () => exerciseType,
  () => {
    if (exerciseType) {
      noteRef.value = exerciseType.note ?? ""
      mediaTypeRef.value = exerciseType.media_type
      youtubeLinkRef.value = exerciseType.youtube_link
      fileNameRef.value = exerciseType.original_file_name
      getMediaBlob()
    }
  },
)

watchDebounced(
  noteRef,
  () => {
    if (noteRef.value && noteRef.value != exerciseType?.note) {
      emitUpdate()
    }
  },
  { debounce: 1000 },
)

watchEffect(() => {
  if (mediaTypeRef.value && mediaTypeRef.value != exerciseType?.media_type) {
    emitUpdate()
  }
})

watchEffect(() => {
  if (youtubeLinkRef.value && youtubeLinkRef.value != exerciseType?.youtube_link) {
    emitUpdate()
  }
})

// Functions
function revokeMediaBlob() {
  if (mediaBlobUrl.value) {
    URL.revokeObjectURL(mediaBlobUrl.value)
    mediaBlobUrl.value = undefined
    mediaBlobType.value = undefined
  }
}

function getMediaBlob() {
  if (!exerciseType) return
  revokeMediaBlob()
  mediaBlobLoading.value = true
  exerciseTypeService
    .getFile(exerciseType.id)
    .then((res) => {
      if (res.type == "text/xml") return
      const blob = res
      mediaBlobType.value = blob.type
      mediaBlobUrl.value = URL.createObjectURL(blob)
    })
    .finally(() => (mediaBlobLoading.value = false))
}

function saveButton() {
  if (isNew && newNameRef.value) {
    emit("create:exerciseType", {
      note: noteRef.value,
      name: newNameRef.value,
      youtube_link: youtubeLinkRef.value,
      media_type: mediaTypeRef.value,
    } as ExerciseTypePostRequest)
    newNameRef.value = ""
  }
  emitUpdate()
}

function emitUpdate() {
  if (!isNew) {
    const data: ExerciseTypeUpdate = {
      youtube_link: youtubeLinkRef.value,
      media_type: mediaTypeRef.value,
      note: noteRef.value,
    }
    emit("update:exerciseType", data)
  }
}

function uploadFile(file: File | File[]) {
  uplodFileInput.value?.blur()
  if (!exerciseType) return
  const formData = new FormData()

  if (isArray(file)) {
    addNotification("Uploading multiple files not supported", "error")
    return
  } else {
    formData.append("file", file)
  }

  fileUploadLoading.value = true
  exerciseTypeService
    .postFile(exerciseType.id, formData)
    .then(() => {
      getMediaBlob()
      fileNameRef.value = file.name
    })
    .finally(() => {
      addNotification("File uploaded succesfully!", "success")
      fileUploadLoading.value = false
      fileRef.value = undefined
    })
}
</script>

<template>
  <v-dialog v-model="active" max-width="1200px">
    <v-card>
      <!-- title -->
      <v-card-title>
        <div v-if="!isNew">
          {{ exerciseType?.name }}
        </div>
        <v-text-field
          v-else
          ref="input"
          v-model="newNameRef"
          type="texts"
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
          <v-btn :value="MediaType.Youtube" class="flex-grow-1">
            <v-icon start>mdi-link</v-icon>
            YouTube Link
          </v-btn>
          <v-btn :value="MediaType.File" class="flex-grow-1">
            <v-icon start>mdi-upload</v-icon>
            Custom media
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

        <div v-if="mediaTypeRef === MediaType.File">
          <v-file-input
            :loading="fileUploadLoading"
            ref="file-upload-input"
            label="Upload new file"
            variant="outlined"
            show-size
            accept="video/*"
            placeholder="Choose a video file to upload"
            prepend-icon=""
            :hint="fileNameRef ?? 'No file found'"
            prepend-inner-icon="mdi-video"
            clearable
            persistent-hint
            @update:model-value="uploadFile"
            v-model="fileRef"
          />
          <div class="d-flex justify-center">
            <v-progress-circular size="100" v-if="mediaBlobLoading" indeterminate />
            <v-responsive v-else v-show="mediaBlobUrl" aspect-ratio="16/9" max-width="500px">
              <video
                controls
                :src="mediaBlobUrl"
                :type="mediaBlobType"
                style="width: 100%; height: 100%; display: block"
              />
            </v-responsive>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey-darken-1" variant="text" @click="active = false">Exit</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveButton">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
