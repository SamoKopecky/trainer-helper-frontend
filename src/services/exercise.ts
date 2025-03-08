import type { Exercise, WorkSet } from "@/types/other"
import { ServiceI, Method, Route } from "./base"

export interface ExerciseResponse extends Exercise {
  work_sets: WorkSet[]
}

export interface ExercisePutRequest {
  id: number
  note?: string
  group_id?: number
}

export interface ExercisePostRequest {
  timeslot_id: number
  group_id: number
}

export interface ExerciseDeleteRequest {
  timeslot_id: number
  exercise_id: number
}

export class ExerciseService extends ServiceI {
  route = Route.Exercise

  async get(timeslot_id: number): Promise<ExerciseResponse[]> {
    return this.handleRequest({
      method: Method.GET,
      url: `${this.get_api_url()}/${timeslot_id}`,
    }) as Promise<ExerciseResponse[]>
  }

  async put(body: ExercisePutRequest): Promise<void> {
    this.handleRequest({ body, method: Method.PUT })
  }

  async post(body: ExercisePostRequest): Promise<ExerciseResponse> {
    return this.handleRequest({ body, method: Method.POST }) as Promise<ExerciseResponse>
  }

  async delete(body: ExerciseDeleteRequest): Promise<void> {
    this.handleRequest({ body, method: Method.DELETE })
  }
}
