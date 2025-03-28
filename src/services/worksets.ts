import { ServiceI, Method, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps: number | null
  intensity: string | null
  rpe: number | null
}

export class WorkSetService extends ServiceI {
  route = Route.WorkSet

  async put(body: WorkSetPutRequest): Promise<void> {
    return this.handleRequest({ body, method: Method.PUT })
  }
}
