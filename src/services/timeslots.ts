import { ServiceBase, Route, Method } from "./base"
import { isArray } from "@/utils/service"
import type { Timeslot } from "@/types/other"

export interface TimeslotGetRequest {
  // TODO: Make date jsonify correcly
  start_date: string
  end_date: string
}

export interface TimeslotPostRequest {
  trainer_id: string
  start: string
  end: string
}

export interface TimeslotPutRequest {
  id: number
  name?: string
  trainee_id?: string
  start?: string
  end?: string
}

export interface TimeslotDeletePathParams {
  id: number
}

export class TimeslotService extends ServiceBase<
  TimeslotPutRequest,
  TimeslotPostRequest,
  Timeslot
> {
  constructor() {
    super(Route.Timeslots)
  }

  private parseTimeslots(obj: unknown): Timeslot[] {
    if (!isArray(obj)) {
      throw new Error("Invalid response: expected an array")
    }

    return obj.map((o: any): Timeslot => {
      o.start = new Date(o.start)
      if (o.week_day) {
        o.week_day.day_date = new Date(o.week_day.day_date)
      }
      return o
    })
  }

  async get(queryParams: TimeslotGetRequest): Promise<Timeslot[]> {
    return this.handleRequest({
      route: this.route,
      method: Method.GET,
      toRes: this.parseTimeslots,
      queryParams,
    }) as Promise<Timeslot[]>
  }
}
