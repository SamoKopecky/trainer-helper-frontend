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

export class ExerciseTypeService extends ServiceBase<
  ExerciseTypePutRequest,
  ExerciseTypePostRequest,
  ExerciseType
> {
  constructor() {
    super(Route.ExerciseTypes)
  }

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

  async postDuplicate(): Promise<ExerciseType[]> {
    return this.handleRequest({
      route: Route.ExerciseTypesDuplicate,
      method: Method.POST,
    }) as Promise<ExerciseType[]>
  }

  public postFile(id: number, data: FormData): Promise<void> {
    return this.handleRequest({
      method: Method.POST,
      route: `${this.route}/:id/files`,
      pathParams: { id },
      postBody: data,
    }) as Promise<void>
  }

  public getFile(id: number): Promise<Blob> {
    return this.handleRequest({
      method: Method.GET,
      route: `${this.route}/:id/files`,
      pathParams: { id },
      responseType: "blob",
    }) as Promise<Blob>
  }
}
