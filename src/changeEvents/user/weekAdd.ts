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
    return {
      block_id: this.activeBlockId,
      label: this.getMaxLabel(this.labeledMap) + 1,
      user_id: this.userId,
      start_date: new Date(),
    }
  }
}
