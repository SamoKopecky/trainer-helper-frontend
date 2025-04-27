import type { Timeslot, WorkSet } from "@/types/other"
import { ServiceI, Method, Route } from "./base"
import type { Exercise } from "@/types/exercise"

export interface FullExerciseResponse {
  exercises: ExerciseResponse[]
  timeslot: Timeslot
}

export interface ExerciseResponse extends Omit<Exercise, "work_set_count"> {
  work_sets: WorkSet[]
}

export interface ExercisePutRequest {
  id: number
  note?: string
  exerciseTypeId?: number
  group_id?: number
}

export interface ExerciseCountDeleteRequest {
  work_set_ids: number[]
}

export interface ExerciseCountPutRequest {
  count: number
  work_set_template: WorkSet
}

export interface ExercisePostRequest {
  timeslot_id: number
  group_id: number
}

export interface ExerciseDeleteRequest {
  timeslot_id: number
  exercise_id: number
}
export interface ExerciseDuplicatePostRequest {
  copy_timeslot_id: number
  timeslot_id: number
}

export class ExerciseService extends ServiceI {
  async get(timeslot_id: number): Promise<FullExerciseResponse> {
    return this.handleRequest({
      method: Method.GET,
      url: `${this.get_api_url(Route.Exercise)}/${timeslot_id}`,
      route: Route.Exercise,
    }) as Promise<FullExerciseResponse>
  }

  async put(body: ExercisePutRequest): Promise<void> {
    this.handleRequest({ body, method: Method.PUT, route: Route.Exercise })
  }

  async post(body: ExercisePostRequest): Promise<ExerciseResponse> {
    return this.handleRequest({
      body,
      method: Method.POST,
      route: Route.Exercise,
    }) as Promise<ExerciseResponse>
  }

  async delete(body: ExerciseDeleteRequest): Promise<void> {
    this.handleRequest({ body, method: Method.DELETE, route: Route.Exercise })
  }

  async putCount(body: ExerciseCountPutRequest): Promise<WorkSet[]> {
    return this.handleRequest({
      body,
      method: Method.PUT,
      route: Route.ExerciseCount,
    }) as Promise<WorkSet[]>
  }

  async deleteCount(body: ExerciseCountDeleteRequest): Promise<number> {
    return this.handleRequest({
      body,
      method: Method.DELETE,
      route: Route.ExerciseCount,
    }) as Promise<number>
  }

  async postDuplicate(body: ExerciseDuplicatePostRequest): Promise<FullExerciseResponse> {
    return this.handleRequest({
      body,
      method: Method.POST,
      route: Route.ExerciseDuplicate,
    }) as Promise<FullExerciseResponse>
  }
}
