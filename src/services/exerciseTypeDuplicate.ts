import type { ExerciseType } from "@/types/exerciseType"
import { ServiceI, Method, Route } from "./base"

export class ExerciseTypeDuplicateService extends ServiceI {
  route = Route.ExerciseTypeDuplicate

  async post(): Promise<ExerciseType[]> {
    return this.handleRequest({ method: Method.POST }) as Promise<ExerciseType[]>
  }
}
