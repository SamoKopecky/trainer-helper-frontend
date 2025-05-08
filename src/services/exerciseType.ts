import type { ExerciseType, ExerciseTypeUpdate, MediaType } from "@/types/exerciseType"
import { ServiceBase, Method, Route } from "./base"

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

export class ExerciseTypeService extends ServiceBase<ExerciseTypePostRequest, ExerciseType> {
  public delete(_id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
  public postUndelete(_id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async get(userId: string): Promise<ExerciseType[]> {
    return this.handleRequest({
      route: Route.ExerciseTypes,
      method: Method.GET,
      queryParams: { user_id: userId },
    }) as Promise<ExerciseType[]>
  }
  async post(body: ExerciseTypePostRequest): Promise<ExerciseType> {
    return this.handleRequest({
      route: Route.ExerciseTypes,
      jsonParams: body,
      method: Method.POST,
    }) as Promise<ExerciseType>
  }

  async put(body: ExerciseTypePutRequest): Promise<void> {
    return this.handleRequest({
      route: Route.ExerciseTypes,
      jsonParams: body,
      method: Method.PUT,
    }) as Promise<void>
  }

  async postDuplicate(): Promise<ExerciseType[]> {
    return this.handleRequest({
      route: Route.ExerciseTypesDuplicate,
      method: Method.POST,
    }) as Promise<ExerciseType[]>
  }
}
