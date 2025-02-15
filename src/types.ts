export interface Event {
  start: string
  end: string
  title: string
  content: string
  timeslot_id: number
}

export interface ChangeNotification {
  type: "success" | "info" | "warning" | "error" | undefined
  text: string
}

export interface WorkSetTableRow {
  key: string
  type: string | null
  name: string
}
