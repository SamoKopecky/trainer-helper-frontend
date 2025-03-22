import { ServiceI, Route, Method } from "./base"
import { isArray } from "@/utils/service"
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

export interface TimeslotPutRequest {
  id: number
  name?: string
  user_id?: number
  start?: string
  end?: string
}

export interface TimeslotDeleteRequest {
  id: number
}

export class TimeslotService extends ServiceI {
  route = Route.Timeslot

  protected get_api_url() {
    return `http://localhost:1323${this.route}`
  }

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

  async put(body: TimeslotPutRequest): Promise<void> {
    return this.handleRequest({ method: Method.PUT, body })
  }

  async delete(body: TimeslotDeleteRequest): Promise<Timeslot> {
    return this.handleRequest({ method: Method.DELETE, body }) as Promise<Timeslot>
  }
}
