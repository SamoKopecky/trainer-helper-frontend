import { BackendConnector, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps: number | null
  intensity: string | null
  rpe: number | null
}

export class WorkSetConnector extends BackendConnector<unknown, unknown, WorkSetPutRequest> {
  route = Route.WorkSet
  obj_to_response(obj: any): any {
    return obj
  }
}
