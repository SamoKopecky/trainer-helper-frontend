import type { Timeslot } from "@/types"
import { BackendConnector, Route, Method } from "./base"
import { isArray } from "./utils"

export interface TimeslotPostRequest {
  // TODO: Make date jsonify correcly
  start_date: string
  end_date: string
}

export class TimeslotConnector extends BackendConnector {
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

  async post(body: TimeslotPostRequest): Promise<Timeslot[]> {
    return this.handleRequest(body, Method.POST, this.parseTimeslots) as Promise<Timeslot[]>
  }
}
