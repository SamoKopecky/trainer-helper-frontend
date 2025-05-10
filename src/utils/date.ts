export function getISODateString(date: Date): string {
  return `${date.toISOString().split(".")[0]}Z`
}

export function getDateWeekDayString(date: Date): string {
  return date.toLocaleString("en-us", { weekday: "long" })
}
