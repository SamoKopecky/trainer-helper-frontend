import type { Timeslot, WorkSet } from "@/types/other"
import { ServiceBase, Method, Route } from "./base"
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
  exercise_id: number
}

export interface ExerciseDuplicatePostRequest {
  copy_timeslot_id: number
  timeslot_id: number
}

export class ExerciseService extends ServiceBase<
  ExercisePutRequest,
  ExercisePostRequest,
  ExerciseResponse
> {
  constructor() {
    super(Route.Exercises)
  }

  async get(timeslot_id: number): Promise<FullExerciseResponse> {
    return this.handleRequest({
      method: Method.GET,
      route: `${this.route}/:id`,
      pathParams: { id: timeslot_id },
    }) as Promise<FullExerciseResponse>
  }

  async putCount(jsonParams: ExerciseCountPutRequest): Promise<WorkSet[]> {
    return this.handleRequest({
      jsonParams,
      method: Method.PUT,
      route: Route.ExercisesCount,
    }) as Promise<WorkSet[]>
  }

  async deleteCount(jsonParams: ExerciseCountDeleteRequest): Promise<number> {
    return this.handleRequest({
      jsonParams,
      method: Method.DELETE,
      route: Route.ExercisesCount,
    }) as Promise<number>
  }

  async postDuplicate(jsonParams: ExerciseDuplicatePostRequest): Promise<FullExerciseResponse> {
    return this.handleRequest({
      jsonParams,
      method: Method.POST,
      route: Route.ExercisesDuplicate,
    }) as Promise<FullExerciseResponse>
  }
}
