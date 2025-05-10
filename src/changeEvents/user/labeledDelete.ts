import type { ServiceBase } from "@/services/base"
import type { ChangeEvent } from "../base"
import type { Labeled } from "@/types/block"

export class LabeledDelete<
  L extends Labeled,
  T extends object,
  PutObj extends object,
  PostObj extends object,
  S extends ServiceBase<PutObj, PostObj, T>,
> implements ChangeEvent
{
  private labeledMap: Map<number, L>
  private service: S
  private deletedBlock: L | undefined

  constructor(labeledMap: Map<number, L>, service: S) {
    this.labeledMap = labeledMap
    this.service = service
  }

  async up(initial: boolean): Promise<void> {
    if (initial) {
      const values = Array.from(this.labeledMap.values())
      this.deletedBlock = values[values.length - 1]
    }

    if (!this.deletedBlock) return
    this.service
      .delete(this.deletedBlock.id)
      .then(() => this.labeledMap.delete(this.deletedBlock!.id))
  }

  async down(): Promise<void> {
    if (!this.deletedBlock) return
    this.service.postUndelete(this.deletedBlock.id).then(() => {
      this.labeledMap.set(this.deletedBlock!.id, this.deletedBlock!)
    })
  }
}
