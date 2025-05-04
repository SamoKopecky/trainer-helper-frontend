import type { Block } from "@/types/block"
import { ServiceI, Route, Method } from "./base"

export class BlockService extends ServiceI {
  route = Route.Users

  async get(userId: string): Promise<Block[]> {
    return this.handleRequest({
      route: Route.Blocks,
      method: Method.GET,
      queryParams: { user_id: userId },
    }) as Promise<Block[]>
  }
}
