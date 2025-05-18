import type { Week } from "@/types/block"
import { ServiceBase, Route, Method } from "./base"

export interface WeekGetRequest {
  user_id: string
  start_date: string
}

export interface WeekPostRequest {
  block_id: number
  label: number
  user_id: string
  is_first: boolean
}

export interface WeekPutRequest {
  id: number
  start_date: string
}

export class WeekService extends ServiceBase<WeekPutRequest, WeekPostRequest, Week> {
  constructor() {
    super(Route.Weeks)
  }

  private parseWeek(week: any): Week {
    week.start_date = new Date(week.start_date)
    return week
  }

  public get(queryParams: WeekGetRequest): Promise<Week> {
    return this.handleRequest({
      method: Method.GET,
      route: this.route,
      queryParams,
      toRes: this.parseWeek,
    }) as Promise<Week>
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
