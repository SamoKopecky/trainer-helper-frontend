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

export interface WorkSetRequest {
  timeslot_id: number
}

export class WorkSetConnector extends BackendConnector<WorkSetRequest, WorkSet> {
  route = Route.WorkSet
  obj_to_response(obj: any): WorkSet {
    return obj
  }
}
