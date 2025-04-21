import { ServiceI, Method, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps?: number
  intensity?: string
  rpe?: number
}

export class WorkSetService extends ServiceI {
  route = Route.WorkSet

  async put(body: WorkSetPutRequest): Promise<void> {
    return this.handleRequest({ body, method: Method.PUT })
  }
}

export class WorkSetsService extends ServiceI {
  route = Route.WorkSets

  async put(body: WorkSetPutRequest[]): Promise<void> {
    return this.handleRequest({ body, method: Method.PUT })
  }
}
