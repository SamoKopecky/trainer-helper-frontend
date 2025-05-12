import type { Block, Week } from "@/types/block"
import { ServiceBase, Route, Method } from "./base"
import { isArray } from "@/utils/service"

export interface BlockPostRequest {
  user_id: string
  label: number
}

export class BlockService extends ServiceBase<object, BlockPostRequest, Block> {
  constructor() {
    super(Route.Blocks)
  }

  private parseBlocks(blocks: any): Block[] {
    if (!isArray(blocks)) {
      throw new Error("Invalid response: expected an array")
    }

    blocks.forEach((b: any) => {
      b.weeks.forEach((w: any) => {
        w.start_date = new Date(w.start_date)
      })
    })
    return blocks as Block[]
  }

  async get(userId: string): Promise<Block[]> {
    return this.handleRequest({
      route: this.route,
      method: Method.GET,
      queryParams: { user_id: userId },
      toRes: this.parseBlocks,
    }) as Promise<Block[]>
  }
}
