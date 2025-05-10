import type { Week } from "@/types/block"
import type { ChangeEvent } from "../base"
import { WeekService, type WeekPostRequest } from "@/services/week"
import { LabeledDelete } from "./labeledDelete"

export class WeekDelete
  extends LabeledDelete<Week, Week, object, WeekPostRequest, WeekService>
  implements ChangeEvent
{
  constructor(weekMap: Map<number, Week>) {
    super(weekMap, new WeekService())
  }
}
