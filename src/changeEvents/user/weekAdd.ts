import { WeekService, type WeekPostRequest } from "@/services/week"
import { LabeledAdd } from "./labeledAdd"
import type { Week } from "@/types/block"

export class WeekAdd extends LabeledAdd<Week, Week, object, WeekPostRequest, WeekService> {
  private activeBlockId: number

  constructor(weekMap: Map<number, Week>, userId: string, activeBlockId: number) {
    super(weekMap, userId, new WeekService())
    this.activeBlockId = activeBlockId
  }

  protected labeledTransfomer(data: Week): Week {
    return data
  }

  protected getPostPayload(): WeekPostRequest {
    const maxLabel = this.getMaxLabel(this.labeledMap)
    return {
      block_id: this.activeBlockId,
      label: maxLabel + 1,
      user_id: this.userId,
      is_first: maxLabel === 0,
    }
  }
}
