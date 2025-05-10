import type { ServiceBase } from "@/services/base"
import type { Labeled } from "@/types/block"
import type { ChangeEvent } from "../base"

export abstract class LabeledAdd<
  L extends Labeled,
  T extends object,
  PutObj extends object,
  PostObj extends object,
  S extends ServiceBase<PutObj, PostObj, T>,
> implements ChangeEvent
{
  private service: S
  protected userId: string
  protected labeledMap: Map<number, L>
  protected createdLabeled: L | undefined

  constructor(labeledMap: Map<number, L>, userId: string, service: S) {
    this.labeledMap = labeledMap
    this.userId = userId
    this.service = service
  }
  protected getMaxLabel<T extends Labeled>(data: Map<number, T>): number {
    const values = Array.from(data.values())
    return values.map((d) => d.label)[values.length - 1] ?? 0
  }

  protected abstract labeledTransfomer(data: T): L
  protected abstract getPostPayload(): PostObj

  async up(initial: boolean): Promise<void> {
    if (initial) {
      this.service.post(this.getPostPayload()).then((res) => {
        this.createdLabeled = this.labeledTransfomer(res)
        this.labeledMap.set(this.createdLabeled.id, this.createdLabeled)
      })
    } else {
      if (!this.createdLabeled) return
      this.service.postUndelete(this.createdLabeled.id).then(() => {
        this.labeledMap.set(this.createdLabeled!.id, this.createdLabeled!)
      })
    }
  }

  async down(): Promise<void> {
    if (!this.createdLabeled) return
    this.service
      .delete(this.createdLabeled.id)
      .then(() => this.labeledMap.delete(this.createdLabeled!.id))
  }
}
