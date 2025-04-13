export function extractYouTubeId(url: string): string | null {
  // Return null if the URL is empty or not a string
  if (!url || typeof url !== "string") {
    return null
  }

  // TODO: Test
  // Regular expression to capture the video ID from various YouTube URL patterns:
  // - youtube.com/watch?v=VIDEO_ID
  // - youtu.be/VIDEO_ID
  // - youtube.com/embed/VIDEO_ID
  // - youtube.com/v/VIDEO_ID
  // - youtube.com/shorts/VIDEO_ID
  // It handles http/https, www optional, and potential query parameters after the ID.
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

  const match = url.match(regex)

  // If a match is found, the ID is in the first capturing group (index 1)
  if (match && match[1]) {
    return match[1]
  }

  // No valid YouTube ID found in the URL
  return null
}
