import { BackendConnector, Route } from "./base"

export interface Timeslot {
  id: number
  trainer_id: number
  user_id: number | null
  duration: number
  start: Date
}

export interface TimeslotPostRequest {
  // TODO: Make date jsonify correcly
  start_date: string
  end_date: string
}

export interface TimeslotPutRequest {}

export class TimeslotConnector extends BackendConnector<
  TimeslotPostRequest,
  Timeslot,
  TimeslotPutRequest
> {
  route = Route.Timeslot
  obj_to_response(obj: any): Timeslot {
    obj.start = new Date(obj.start)
    return obj
  }
}
