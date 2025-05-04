import type { Week } from "@/types/block"
import { ServiceI, Method, Route } from "./base"

export interface WeekPostRequest {
  block_id: number
  start_date: Date
  label: number
}

export class WeekService extends ServiceI {
  async post(jsonParams: WeekPostRequest): Promise<Week> {
    return this.handleRequest({
      jsonParams,
      method: Method.POST,
      route: Route.Weeks,
    }) as Promise<Week>
  }

  async delete(id: number): Promise<void> {
    return this.handleRequest({
      pathParams: { id: id },
      method: Method.DELETE,
      route: Route.WeeksId,
    }) as Promise<void>
  }
}
