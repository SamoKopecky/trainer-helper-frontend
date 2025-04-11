import type { ExerciseType } from "@/types/other"
import { ServiceI, Method, Route } from "./base"

export class ExerciseTypeDuplicateService extends ServiceI {
  route = Route.ExerciseTypeDuplicate

  async post(): Promise<ExerciseType[]> {
    return this.handleRequest({ method: Method.POST }) as Promise<ExerciseType[]>
  }
}
