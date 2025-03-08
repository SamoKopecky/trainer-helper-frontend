import type { VueCalDate } from "@/types/vuecal"

export function getISODateString(date: VueCalDate): string {
  return date.toISOString().split(".")[0]
}

export function isoToLocal(date: string): Date {
  const naiveDate = new Date(date)
  const offset = naiveDate.getTimezoneOffset()
  return new Date(naiveDate.getTime() - offset * 60 * 1000)
}
