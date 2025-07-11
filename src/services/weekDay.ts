import type { Week, WeekDay } from "@/types/block"
import { ServiceBase, Route, Method } from "./base"
import { isArray } from "@/utils/service"
import type { ExerciseResponse } from "./exercise"

export interface WeekDayGetRequest {
  // this one
  week_id?: number

  // or these two
  day_date?: string
  user_id?: string
}

export interface WeekDayPutRequest {
  id: number
  name?: string
  day_date?: string
  timeslot_id?: number
}

export interface WeekDayPostRequest {
  week_id: number
  user_id: string
  day_date: string
  name?: string
}

export interface WeekDayFromRawPostRequest {
  raw_data: string
  week_day_id: number
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
      w.is_deleted = Boolean(w.deleted_at)
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
    })
  }

  public async postFromRaw(jsonParams: WeekDayFromRawPostRequest): Promise<ExerciseResponse[]> {
    return this.handleRequest({
      jsonParams,
      method: Method.POST,
      route: `${this.route}/from-raw`,
    }) as Promise<ExerciseResponse[]>
  }

  public async getMany(queryParams: WeekDayGetRequest): Promise<WeekDay[]> {
    return this.handleRequest({
      route: this.route,
      method: Method.GET,
      queryParams,
      toRes: this.parseWeekDays,
    }) as Promise<WeekDay[]>
  }

  public async get(id: number): Promise<WeekDay> {
    return this.handleRequest({
      route: `${this.route}/:id`,
      method: Method.GET,
      pathParams: { id },
    }) as Promise<WeekDay>
  }

  public async deleteTimeslot(id: number): Promise<void> {
    return this.handleRequest({
      route: `${Route.WeekDaysTimeslots}/:id`,
      method: Method.DELETE,
      pathParams: { id },
    }) as Promise<void>
  }
}
