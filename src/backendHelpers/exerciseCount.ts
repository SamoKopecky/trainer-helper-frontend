import type { WorkSet, WorkSetModel } from "../types"
import { BackendConnector, Method, Route } from "./base"
import { isArray } from "./utils"

export interface ExerciseCountDeleteRequest {
  work_set_ids: number[]
}

export interface ExerciseCountPutRequest {
  id: number
  work_set_count: number
  work_set_template: WorkSet
}

export class ExerciseCountConnector extends BackendConnector {
  route = Route.ExerciseCount

  private parseWorkSetModels(obj: unknown): WorkSetModel[] {
    if (!isArray(obj)) {
      throw new Error("Invalid response: expected an array")
    }

    return obj.map((o: any): WorkSetModel => {
      o["work_set_id"] = o["id"]
      delete o["id"]
      return o
    })
  }

  async put(body: ExerciseCountPutRequest): Promise<WorkSetModel[]> {
    return this.handleRequest(body, Method.PUT, this.parseWorkSetModels) as Promise<WorkSetModel[]>
  }

  async delete(body: ExerciseCountDeleteRequest): Promise<number> {
    return this.handleRequest(body, Method.DELETE) as Promise<number>
  }
}
