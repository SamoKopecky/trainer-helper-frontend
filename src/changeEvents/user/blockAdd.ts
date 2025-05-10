import { BlockService, type BlockPostRequest } from "@/services/block"
import { LabeledAdd } from "./labeledAdd"
import type { Block, BlockValue } from "@/types/block"
import { blockToBlockValue } from "@/utils/tranformators"

export class BlockAdd extends LabeledAdd<
  BlockValue,
  Block,
  object,
  BlockPostRequest,
  BlockService
> {
  constructor(blockMap: Map<number, BlockValue>, userId: string) {
    super(blockMap, userId, new BlockService())
  }

  protected labeledTransfomer(data: Block): BlockValue {
    return blockToBlockValue(data)
  }

  protected getPostPayload(): BlockPostRequest {
    return {
      label: this.getMaxLabel(this.labeledMap) + 1,
      user_id: this.userId,
    }
  }
}
