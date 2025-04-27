import { ServiceI, Route, Method } from "./base"
import { isArray } from "@/utils/service"
import type { Timeslot } from "@/types/other"

export interface TimeslotGetRequest {
  // TODO: Make date jsonify correcly
  start_date: string
  end_date: string
}

export interface TimeslotRevertPutRequest {
  id: number
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
  deleted_at?: string
}

export interface TimeslotDeleteRequest {
  id: number
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
    const requestUrl = new URL(this.get_api_url(Route.Timeslot))
    requestUrl.searchParams.append("start_date", body.start_date)
    requestUrl.searchParams.append("end_date", body.end_date)
    return this.handleRequest({
      route: Route.Timeslot,
      method: Method.GET,
      toRes: this.parseTimeslots,
      url: requestUrl.toString(),
    }) as Promise<Timeslot[]>
  }

  async post(body: TimeslotPostRequest): Promise<Timeslot> {
    return this.handleRequest({
      route: Route.Timeslot,
      method: Method.POST,
      body,
    }) as Promise<Timeslot>
  }

  async put(body: TimeslotPutRequest): Promise<void> {
    return this.handleRequest({ route: Route.Timeslot, method: Method.PUT, body })
  }

  async delete(body: TimeslotDeleteRequest): Promise<Timeslot> {
    return this.handleRequest({
      route: Route.Timeslot,
      method: Method.DELETE,
      body,
    }) as Promise<Timeslot>
  }

  async putRevert(body: TimeslotRevertPutRequest): Promise<void> {
    return this.handleRequest({ body, method: Method.PUT, route: Route.TimeslotRevert })
  }
}
