import type { ExerciseType, ExerciseTypeUpdate, MediaType } from "@/types/exerciseType"
import { ServiceI, Method, Route } from "./base"

export interface ExerciseTypeGetRequest {
  user_id: string
}

export interface ExerciseTypePostRequest {
  name: string
  note?: string
  media_type?: MediaType
  youtube_link?: string
  file_path?: string
}

export interface ExerciseTypePutRequest extends ExerciseTypeUpdate {
  id: number
}

export class ExerciseTypeService extends ServiceI {
  route = Route.ExerciseType

  async get(body: ExerciseTypeGetRequest): Promise<ExerciseType[]> {
    const requestUrl = new URL(this.get_api_url(Route.ExerciseType))
    requestUrl.searchParams.append("user_id", body.user_id)
    return this.handleRequest({
      route: Route.ExerciseType,
      method: Method.GET,
      url: requestUrl.toString(),
    }) as Promise<ExerciseType[]>
  }
  async post(body: ExerciseTypePostRequest): Promise<ExerciseType> {
    return this.handleRequest({
      route: Route.ExerciseType,
      body: body,
      method: Method.POST,
    }) as Promise<ExerciseType>
  }

  async put(body: ExerciseTypePutRequest): Promise<void> {
    return this.handleRequest({
      route: Route.ExerciseType,
      body: body,
      method: Method.PUT,
    }) as Promise<void>
  }

  async postDuplicate(): Promise<ExerciseType[]> {
    return this.handleRequest({
      route: Route.ExerciseTypeDuplicate,
      method: Method.POST,
    }) as Promise<ExerciseType[]>
  }
}
