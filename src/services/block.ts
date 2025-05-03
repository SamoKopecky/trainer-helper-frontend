import type { Block } from "@/types/block"
import { ServiceI, Route, Method } from "./base"

export interface BlockGetRequest {
  user_id: string
}

export class BlockService extends ServiceI {
  route = Route.User

  async get(body: BlockGetRequest): Promise<Block[]> {
    // TODO: Make this get friednly
    const requestUrl = new URL(this.get_api_url(Route.Block))
    requestUrl.searchParams.append("user_id", body.user_id)
    return this.handleRequest({
      route: Route.ExerciseType,
      method: Method.GET,
      url: requestUrl.toString(),
    }) as Promise<Block[]>
  }
}
