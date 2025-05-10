import type { WeekDay } from "@/types/block"
import { ServiceBase, Route } from "./base"

export interface WeekDayPutRequest {
  id: number
  name?: string
}

export class WeekDayService extends ServiceBase<WeekDayPutRequest, object, WeekDay> {
  constructor() {
    super(Route.WeekDays)
  }
}
