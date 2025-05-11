import type { Week, WeekDay } from "@/types/block"
import { ServiceBase, Route, Method } from "./base"

export interface WeekPostRequest {
  block_id: number
  label: number
  user_id: string
}

export class WeekService extends ServiceBase<object, WeekPostRequest, Week> {
  constructor() {
    super(Route.Weeks)
  }

  private parseWeek(week: any): Week {
    week.start_date = new Date(week.start_date)
    week.week_days.forEach((wd: WeekDay) => {
      wd.day_date = new Date(wd.day_date)
    })
    return week
  }

  public post(jsonParams: WeekPostRequest): Promise<Week> {
    return this.handleRequest({
      jsonParams,
      method: Method.POST,
      route: this.route,
      toRes: this.parseWeek,
    }) as Promise<Week>
  }
}
