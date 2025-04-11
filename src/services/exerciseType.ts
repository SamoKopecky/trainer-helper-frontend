import type { ExerciseType } from "@/types/other"
import { ServiceI, Method, Route } from "./base"

export interface ExerciseTypeGetRequest {
  user_id: string
}

export interface ExerciseTypePostRequest {
  user_id: string
  name: string
  note?: string
}

export interface ExerciseTypePutRequest {
  id: number
  note?: string
  media_type?: string
  media_address?: string
}

export class ExerciseTypeService extends ServiceI {
  route = Route.ExerciseType

  async get(body: ExerciseTypeGetRequest): Promise<ExerciseType[]> {
    const requestUrl = new URL(this.get_api_url())
    requestUrl.searchParams.append("user_id", body.user_id)
    return this.handleRequest({ method: Method.GET, url: requestUrl.toString() }) as Promise<
      ExerciseType[]
    >
  }
  async post(body: ExerciseTypePostRequest): Promise<ExerciseType> {
    return this.handleRequest({ body: body, method: Method.POST }) as Promise<ExerciseType>
  }

  async put(body: ExerciseTypePutRequest): Promise<void> {
    return this.handleRequest({ body: body, method: Method.PUT }) as Promise<void>
  }
}
