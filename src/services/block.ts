import type { Block } from "@/types/block"
import { ServiceBase, Route, Method } from "./base"

export interface BlockPostRequest {
  user_id: string
  label: number
}

export class BlockService extends ServiceBase<BlockPostRequest, Block> {
  route = Route.Users

  async get(userId: string): Promise<Block[]> {
    return this.handleRequest({
      route: Route.Blocks,
      method: Method.GET,
      queryParams: { user_id: userId },
    }) as Promise<Block[]>
  }

  async post(jsonParams: BlockPostRequest): Promise<Block> {
    return this.handleRequest({
      route: Route.Blocks,
      method: Method.POST,
      jsonParams,
    }) as Promise<Block>
  }

  async delete(id: number): Promise<void> {
    return this.handleRequest({
      pathParams: { id: id },
      method: Method.DELETE,
      route: Route.BlocksId,
    }) as Promise<void>
  }

  async postUndelete(id: number): Promise<void> {
    return this.handleRequest({
      pathParams: { id: id },
      method: Method.POST,
      route: Route.BlocksUndelete,
    }) as Promise<void>
  }
}
