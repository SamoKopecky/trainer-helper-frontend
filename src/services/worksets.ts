import { Service, Method, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps: number | null
  intensity: string | null
  rpe: number | null
}

export class WorkSetService extends Service {
  route = Route.WorkSet

  async put(body: WorkSetPutRequest): Promise<void> {
    return this.handleRequest(body, Method.PUT)
  }
}
