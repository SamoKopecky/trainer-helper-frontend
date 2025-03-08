import { ServiceI, Route, Method } from "./base"
import { isArray } from "../utils/serviceUtils"
import type { Timeslot } from "@/types/other"

export interface TimeslotGetRequest {
  // TODO: Make date jsonify correcly
  start_date: string
  end_date: string
}

export interface TimeslotPostRequest {
  trainer_id: number
  start: string
  end: string
}

export interface TimeslotDeleteRequest {
  timeslot_id: number
}

export class TimeslotService extends ServiceI {
  route = Route.Timeslot

  private parseTimeslots(obj: unknown): Timeslot[] {
    if (!isArray(obj)) {
      throw new Error("Invalid response: expected an array")
    }

    return obj.map((o: any): Timeslot => {
      o.start = new Date(o.start)
      return o
    })
  }

  async get(body: TimeslotGetRequest): Promise<Timeslot[]> {
    const requestUrl = new URL(this.get_api_url())
    requestUrl.searchParams.append("start_date", body.start_date)
    requestUrl.searchParams.append("end_date", body.end_date)
    return this.handleRequest({
      method: Method.GET,
      toRes: this.parseTimeslots,
      url: requestUrl.toString(),
    }) as Promise<Timeslot[]>
  }

  async post(body: TimeslotPostRequest): Promise<Timeslot> {
    return this.handleRequest({ method: Method.POST, body }) as Promise<Timeslot>
  }

  async delete(body: TimeslotDeleteRequest): Promise<Timeslot> {
    return this.handleRequest({ method: Method.DELETE, body }) as Promise<Timeslot>
  }
}
