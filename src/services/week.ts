import type { Week } from "@/types/block"
import { ServiceBase, Route } from "./base"

export interface WeekPostRequest {
  block_id: number
  start_date: Date
  label: number
  user_id: string
}

export class WeekService extends ServiceBase<WeekPostRequest, Week> {
  constructor() {
    super(Route.Weeks)
  }
}
