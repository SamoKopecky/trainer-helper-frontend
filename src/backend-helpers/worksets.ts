import { BackendConnector, Route } from "./base"

export interface WorkSet {
  id: number
  timeslot_id: number
  timeslot_index: number
  set_type: string
  reps: number
  intensity: string
  rpe: number
  tempo: string | null
  note: string | null
}

export interface WorkSetPostRequest {
  timeslot_id: number
}

export interface WorkSetPutRequest {
  id: number
  reps: number | null
  intensity: string | null
  rpe: number | null
  tempo: string | null
  note: string | null
}

export class WorkSetConnector extends BackendConnector<
  WorkSetPostRequest,
  WorkSet,
  WorkSetPutRequest
> {
  route = Route.WorkSet
  obj_to_response(obj: any): WorkSet {
    return obj
  }
}
