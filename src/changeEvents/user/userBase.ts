import type { Labeled } from "@/types/block"

export class UserBaseUpdate {
  protected getMaxLabel<T extends Labeled>(data: Map<number, T>): number {
    const values = Array.from(data.values())
    return values.map((d) => d.label)[values.length - 1] ?? 0
  }
}
