import type { WorkSet } from "@/types/other"
import { ServiceBase, Method, Route } from "./base"

export interface WorkSetPutRequest {
  id: number
  reps?: number
  intensity?: string
  rpe?: string
}

export interface WorkSetPostUndeleteRequest {
  ids: number[]
}

export class WorkSetService extends ServiceBase<object, object, WorkSet> {
  constructor() {
    super(Route.WorkSets)
  }

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
      route: this.route,
    }) as Promise<void>
  }

  async putMany(jsonParams: WorkSetPutRequest[]): Promise<void> {
    return this.handleRequest({
      jsonParams,
      method: Method.PUT,
      route: this.route,
    }) as Promise<void>
  }

  async undeleteMany(jsonParams: WorkSetPostUndeleteRequest): Promise<void> {
    return this.handleRequest({
      jsonParams: jsonParams,
      method: Method.POST,
      route: `${this.route}/undelete`,
    }) as Promise<void>
  }
}
