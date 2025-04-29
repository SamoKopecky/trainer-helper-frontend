import { ServiceI, Method, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps?: number
  intensity?: string
  rpe?: number
}

export interface WorkSetPostUndeleteRequest {
  ids: number[]
}

export class WorkSetService extends ServiceI {
  route = Route.WorkSet

  async put(body: WorkSetPutRequest): Promise<void> {
    return this.handleRequest({ body: [body], method: Method.PUT, route: Route.WorkSet })
  }

  async putMany(body: WorkSetPutRequest[]): Promise<void> {
    return this.handleRequest({ body, method: Method.PUT, route: Route.WorkSet })
  }

  async undeleteMany(body: WorkSetPostUndeleteRequest): Promise<void> {
    return this.handleRequest({ body, method: Method.POST, route: Route.WorkSetUndelete })
  }
}
