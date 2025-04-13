<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
})

// Compute the embed URL
const embedUrl = computed(() => {
  return `https://www.youtube.com/embed/${props.videoId}?rel=0` // rel=0 prevents related videos from other channels
})

// Compute the aspect ratio padding
const wrapperStyle = computed(() => ({
  paddingTop: `${(9 / 16) * 100}%`,
}))
</script>

<template>
  <div class="youtube-embed-wrapper" :style="wrapperStyle">
    <iframe
      :src="embedUrl"
      :title="`YouTube video player for video ID ${videoId}`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</template>

<style scoped>
.youtube-embed-wrapper {
  position: relative; /* Establishes positioning context for the iframe */
  overflow: hidden; /* Ensures content doesn't spill out */
  width: 100%; /* Takes the full width of its parent */
  height: 0; /* Height is controlled by padding-top */
}

.youtube-embed-wrapper iframe {
  position: absolute; /* Positions the iframe relative to the wrapper */
  top: 0;
  left: 0;
  width: 100%; /* Makes the iframe fill the wrapper horizontally */
  height: 100%; /* Makes the iframe fill the wrapper vertically */
  border: 0; /* Removes default iframe border */
}
</style>
