import { WorkSetModel } from "../types"
import { BackendConnector, Route } from "./base"

export interface ExerciseCountPutRequest {
  id: number
  note: string | null
}

export interface ExerciseCountPutResponse {
  new_work_sets: WorkSetModel[]
}

export class ExerciseCountConnector extends BackendConnector<
  unknown,
  ExerciseCountPutResponse,
  ExerciseCountPutRequest
> {
  route = Route.ExerciseCount
  obj_to_response(obj: any): any {
    return obj
  }

  async put_return(body: ExerciseCountPutRequest): Promise<ExerciseCountPutResponse[]> {
    const request = {
      method: "PUT",
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    const jsonRes: unknown[] = await (await fetch(this.get_api_url(), request)).json()
    // TODO: Fix this!!!
    return jsonRes["new_work_sets"].map(
      (obj: unknown): ExerciseCountPutResponse => this.obj_to_response(obj),
    )
  }
}
