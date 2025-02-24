import type { Exercise, WorkSet } from "../types"
import { BackendConnector, Method, Route } from "./base"

export interface ExerciseResponse extends Exercise {
  work_sets: WorkSet[]
}

export interface ExercisePutRequest {
  id: number
  note: string | null
}

export interface ExercisePostDeleteRequest {
  timeslot_id: number
  group_id: number
}

export class ExerciseConnector extends BackendConnector {
  route = Route.Exercise

  // TODO: Fix this
  async get(timeslot_id: number): Promise<ExerciseResponse[]> {
    const api_url = `${this.get_api_url()}/${timeslot_id}`

    const jsonRes: any[] = await (await fetch(api_url)).json()
    return jsonRes.map((obj: any): ExerciseResponse => obj as ExerciseResponse)
  }

  async put(body: ExercisePutRequest): Promise<void> {
    this.handleRequest(body, Method.PUT)
  }

  async post(body: ExercisePostDeleteRequest): Promise<ExerciseResponse> {
    return this.handleRequest(body, Method.POST) as Promise<ExerciseResponse>
  }

  async delete(body: ExercisePostDeleteRequest): Promise<void> {
    this.handleRequest(body, Method.DELETE)
  }
}
