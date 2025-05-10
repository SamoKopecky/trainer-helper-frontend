import type { Block, Week, WeekDay } from "@/types/block"
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

  private parseBlocks(blocks: unknown): Block[] {
    if (!isArray(blocks)) {
      throw new Error("Invalid response: expected an array")
    }

    blocks.forEach((b: Block) => {
      b.weeks.forEach((w: Week) => {
        w.week_days.map((wd: WeekDay): WeekDay => {
          wd.day_date = new Date(wd.day_date)
        })
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
