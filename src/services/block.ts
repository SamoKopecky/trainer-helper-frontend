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

  async post(label: number): Promise<Block> {
    return this.handleRequest({
      route: Route.Blocks,
      method: Method.POST,
      queryParams: { label: label },
    }) as Promise<Block>
  }

  async delete(id: number): Promise<void> {
    return this.handleRequest({
      pathParams: { id: id },
      method: Method.DELETE,
      route: Route.BlocksId,
    }) as Promise<void>
  }
}
