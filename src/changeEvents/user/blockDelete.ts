import type { BlockMap, BlockValue } from "@/types/block"
import type { ChangeEvent } from "../base"
import { BlockService } from "@/services/block"

export class BlockDelete implements ChangeEvent {
  private activeBlocks: BlockMap
  private service: BlockService
  private deletedBlock: BlockValue | undefined

  constructor(blockMap: BlockMap) {
    this.activeBlocks = blockMap
    this.service = new BlockService()
  }

  async up(initial: boolean): Promise<void> {
    if (initial) {
      const values = Array.from(this.activeBlocks.values())
      this.deletedBlock = values[values.length - 1]
    }

    if (!this.deletedBlock) return
    this.service
      .delete(this.deletedBlock.id)
      .then(() => this.activeBlocks.delete(this.deletedBlock!.id))
  }

  async down(): Promise<void> {
    if (!this.deletedBlock) return
    this.service.postUndelete(this.deletedBlock.id).then(() => {
      this.activeBlocks.set(this.deletedBlock!.id, this.deletedBlock!)
    })
  }
}
