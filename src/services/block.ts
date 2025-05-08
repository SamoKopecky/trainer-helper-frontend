import type { Block } from "@/types/block"
import { ServiceBase, Route, Method } from "./base"

export interface BlockPostRequest {
  user_id: string
  label: number
}

export class BlockService extends ServiceBase<BlockPostRequest, Block> {
  constructor() {
    super(Route.Blocks)
  }

  async get(userId: string): Promise<Block[]> {
    return this.handleRequest({
      route: Route.Blocks,
      method: Method.GET,
      queryParams: { user_id: userId },
    }) as Promise<Block[]>
  }
}
