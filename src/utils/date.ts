import type { Week } from "@/types/block"

export function getISODateTimeString(date: Date): string {
  return `${date.toISOString().split(".")[0]}Z`
}

export function getISODateString(date: Date): string {
  // Ugly chack to proevent timezone messing up date
  const newDate = new Date(date.valueOf())
  newDate.setHours(12)
  return newDate.toISOString().split("T")[0]
}

export function getDateWeekDayString(date: Date): string {
  return date.toLocaleString("en-us", { weekday: "long" })
}

export function getClosestWeek(weeks: Week[]): Week {
  let closest = weeks[0]
  const now = new Date()
  weeks.forEach((w) => {
    const distance = Math.abs(now.getTime() - w.start_date.getTime())
    const closestDistance = Math.abs(now.getTime() - closest.start_date.getTime())
    if (distance < closestDistance) {
      closest = w
    }
  })

  return closest
}

export function formatDate(date: Date) {
  if (!date) return ""
  return new Date(date).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
  })
}

export function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}
