import type { Week } from "@/types/block"
import type { ChangeEvent } from "../base"
import { WeekService } from "@/services/week"

export class WeekDelete implements ChangeEvent {
  private activeWeeks: Map<number, Week>
  private service: WeekService
  private deletedWeek: Week | undefined

  constructor(blockMap: Map<number, Week>) {
    this.activeWeeks = blockMap
    this.service = new WeekService()
  }

  async up(initial: boolean): Promise<void> {
    if (initial) {
      const values = Array.from(this.activeWeeks.values())
      this.deletedWeek = values[values.length - 1]
    }

    if (!this.deletedWeek) return
    this.service
      .delete(this.deletedWeek.id)
      .then(() => this.activeWeeks.delete(this.deletedWeek!.id))
  }

  async down(): Promise<void> {
    if (!this.deletedWeek) return
    this.service.postUndelete(this.deletedWeek.id).then(() => {
      this.activeWeeks.set(this.deletedWeek!.id, this.deletedWeek!)
    })
  }
}
