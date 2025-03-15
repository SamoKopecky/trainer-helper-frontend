import { ServiceI, Method, Route } from "./base"
import type { FullExerciseResponse } from "./exercise"

export interface ExerciseDuplicatePostRequest {
  copy_timeslot_id: number
  timeslot_id: number
}

export class ExerciseDuplicateService extends ServiceI {
  route = Route.ExerciseDuplicate

  async post(body: ExerciseDuplicatePostRequest): Promise<FullExerciseResponse> {
    return this.handleRequest({ body, method: Method.POST }) as Promise<FullExerciseResponse>
  }
}
