import type { Block, BlockMap, BlockValue } from "@/types/block"
import type { ChangeEvent } from "../base"
import { BlockService, type BlockPostRequest } from "@/services/block"
import { LabeledDelete } from "./labeledDelete"

export class BlockDelete
  extends LabeledDelete<BlockValue, BlockPostRequest, Block, BlockService>
  implements ChangeEvent
{
  constructor(blockMap: BlockMap) {
    super(blockMap, new BlockService())
  }
}
