import type { BlockMap, BlockValue } from "@/types/block"
import type { ChangeEvent } from "../base"
import { UserBaseUpdate } from "./userBase"
import { BlockService } from "@/services/block"
import { blockToBlockValue } from "@/utils/tranformators"

export class BlockAdd extends UserBaseUpdate implements ChangeEvent {
  private activeBlocks: BlockMap
  private userId: string
  private service: BlockService
  private createdBlock: BlockValue | undefined

  constructor(blockMap: BlockMap, userId: string) {
    super()
    this.activeBlocks = blockMap
    this.userId = userId
    this.service = new BlockService()
  }

  async up(initial: boolean): Promise<void> {
    if (initial) {
      this.service
        .post({ user_id: this.userId, label: this.getMaxLabel(this.activeBlocks) + 1 })
        .then((res) => {
          this.createdBlock = blockToBlockValue(res)
          this.activeBlocks.set(res.id, this.createdBlock)
        })
    } else {
      if (!this.createdBlock) return
      this.service.postUndelete(this.createdBlock.id).then(() => {
        this.activeBlocks.set(this.createdBlock!.id, this.createdBlock!)
      })
    }
  }

  async down(): Promise<void> {
    if (!this.createdBlock) return
    this.service
      .delete(this.createdBlock.id)
      .then(() => this.activeBlocks.delete(this.createdBlock!.id!))
  }
}
