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
    return this.handleRequest({ body: [body], method: Method.PUT })
  }

  async putMany(body: WorkSetPutRequest[]): Promise<void> {
    return this.handleRequest({ body, method: Method.PUT })
  }
}
