export function getISODateTimeString(date: Date): string {
  return `${date.toISOString().split(".")[0]}Z`
}

export function getISODateString(date: Date): string {
  // Ugly chack to proevent timezone messing up date
  date.setHours(12)
  return date.toISOString().split("T")[0]
}

export function getDateWeekDayString(date: Date): string {
  return date.toLocaleString("en-us", { weekday: "long" })
}
