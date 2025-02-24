import { BackendConnector, Method, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps: number | null
  intensity: string | null
  rpe: number | null
}

export class WorkSetConnector extends BackendConnector {
  route = Route.WorkSet

  async put(body: WorkSetPutRequest): Promise<void> {
    return this.handleRequest(body, Method.PUT)
  }
}
