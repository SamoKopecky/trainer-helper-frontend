import { WeekService } from "@/services/week"
import type { ChangeEvent } from "../base"
import type { Week } from "@/types/block"
import { UserBaseUpdate } from "./userBase"

export class WeekAdd extends UserBaseUpdate implements ChangeEvent {
  private activeWeeks: Map<number, Week>
  private activeBlockId: number
  private userId: string
  private service: WeekService
  private createdWeek: Week | undefined

  constructor(weekMap: Map<number, Week>, userId: string, activeBlockId: number) {
    super()
    this.activeWeeks = weekMap
    this.userId = userId
    this.service = new WeekService()
    this.activeBlockId = activeBlockId
  }

  async up(initial: boolean): Promise<void> {
    if (initial) {
      this.service
        .post({
          label: this.getMaxLabel(this.activeWeeks) + 1,
          block_id: this.activeBlockId,
          start_date: new Date(),
          user_id: this.userId,
        })
        .then((res) => {
          this.createdWeek = res
          this.activeWeeks.set(res.id, this.createdWeek)
        })
    } else {
      if (!this.createdWeek) return
      this.service
        .postUndelete(this.createdWeek.id)
        .then(() => this.activeWeeks.set(this.createdWeek!.id, this.createdWeek!))
    }
  }

  async down(): Promise<void> {
    if (!this.createdWeek) return
    this.service
      .delete(this.createdWeek.id)
      .then(() => this.activeWeeks.delete(this.createdWeek!.id!))
  }
}
