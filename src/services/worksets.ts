import type { WorkSet } from "@/types/other"
import { ServiceBase, Method, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps?: number
  intensity?: string
  rpe?: number
}

export interface WorkSetPostUndeleteRequest {
  ids: number[]
}

export class WorkSetService extends ServiceBase<object, WorkSet> {
  public post(_jsonParams: object): Promise<WorkSet> {
    throw new Error("Method not implemented.")
  }
  public delete(_id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
  public postUndelete(_id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async put(jsonParams: WorkSetPutRequest): Promise<void> {
    return this.handleRequest({
      jsonParams: [jsonParams],
      method: Method.PUT,
      route: Route.WorkSets,
    }) as Promise<void>
  }

  async putMany(jsonParams: WorkSetPutRequest[]): Promise<void> {
    return this.handleRequest({
      jsonParams: jsonParams,
      method: Method.PUT,
      route: Route.WorkSets,
    }) as Promise<void>
  }

  async undeleteMany(jsonParams: WorkSetPostUndeleteRequest): Promise<void> {
    return this.handleRequest({
      jsonParams: jsonParams,
      method: Method.POST,
      route: Route.WorkSetsUndelete,
    }) as Promise<void>
  }
}
