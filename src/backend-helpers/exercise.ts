import type { SetType } from "@/types"
import { BackendConnector, Route } from "./base"

export interface Exercise {
  exercise_id: number
  group_id: number
  note: string | null
  set_type: SetType
  work_set_count: number
  work_sets: ExerciseWorkSet[]
}

export interface ExerciseWorkSet {
  intensity: string
  reps: number
  rpe: number | null
  work_set_id: number
}

export class ExerciseConnector extends BackendConnector<unknown, unknown, unknown> {
  route = Route.Exercise
  obj_to_response(obj: any): Exercise {
    return obj
  }

  async get(timeslot_id: number): Promise<Exercise[]> {
    const api_url = `${this.get_api_url()}/${timeslot_id}`

    const jsonRes: any[] = await (await fetch(api_url)).json()
    return jsonRes.map((obj: any): Exercise => this.obj_to_response(obj))
  }
}
