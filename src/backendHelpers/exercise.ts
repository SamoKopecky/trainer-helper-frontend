import type { Exercise, WorkSet } from "../types"
import { BackendConnector, Method, Route } from "./base"

export interface ExerciseGetResponse extends Exercise {
  work_sets: WorkSet[]
}

export interface ExercisePutRequest {
  id: number
  note: string | null
}

export class ExerciseConnector extends BackendConnector {
  route = Route.Exercise

  // TODO: Fix this
  async get(timeslot_id: number): Promise<ExerciseGetResponse[]> {
    const api_url = `${this.get_api_url()}/${timeslot_id}`

    const jsonRes: any[] = await (await fetch(api_url)).json()
    return jsonRes.map((obj: any): ExerciseGetResponse => obj as ExerciseGetResponse)
  }

  async put(body: ExercisePutRequest): Promise<void> {
    this.handleRequest(body, Method.PUT)
  }
}
