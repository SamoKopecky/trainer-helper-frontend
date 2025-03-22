import { ServiceI, Method, Route } from "./base"
import type { WorkSet } from "@/types/other"

export interface ExerciseCountDeleteRequest {
  work_set_ids: number[]
}

export interface ExerciseCountPutRequest {
  id: number
  count: number
  work_set_template: WorkSet
}

export class ExerciseCountService extends ServiceI {
  route = Route.ExerciseCount

  async put(body: ExerciseCountPutRequest): Promise<WorkSet[]> {
    return this.handleRequest({
      body,
      method: Method.PUT,
    }) as Promise<WorkSet[]>
  }

  async delete(body: ExerciseCountDeleteRequest): Promise<number> {
    return this.handleRequest({ body, method: Method.DELETE }) as Promise<number>
  }
}
