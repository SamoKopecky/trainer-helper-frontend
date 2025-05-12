import type { WeekDay } from "@/types/block"
import { ServiceBase, Route, Method } from "./base"
import { isArray } from "@/utils/service"

export interface WeekDayPutRequest {
  id: number
  name?: string
}

export interface WeekDayPostRequest {
  week_id: number
  user_id: string
  day_date: string
  name?: string
}

export class WeekDayService extends ServiceBase<WeekDayPutRequest, WeekDayPostRequest, WeekDay> {
  constructor() {
    super(Route.WeekDays)
  }

  private parseWeekDays(weekDays: any): WeekDay[] {
    if (!isArray(weekDays)) {
      throw new Error("Invalid response: expected an array")
    }

    weekDays.forEach((w: any) => {
      w.day_date = new Date(w.day_date)
    })
    return weekDays as WeekDay[]
  }

  public async post(jsonParams: WeekDayPostRequest): Promise<WeekDay> {
    return this.handleRequest({
      jsonParams,
      method: Method.POST,
      route: this.route,
      toRes: (obj: any) => {
        obj.day_date = new Date(obj.day_date)
        return obj
      },
    }) as Promise<WeekDay>
  }

  async get(weekId: number): Promise<WeekDay[]> {
    return this.handleRequest({
      route: this.route,
      method: Method.GET,
      queryParams: { week_id: weekId },
      toRes: this.parseWeekDays,
    }) as Promise<WeekDay[]>
  }
}
