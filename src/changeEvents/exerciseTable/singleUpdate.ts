import { WorkSetService } from "@/services/worksets"
import type { ChangeEvent } from "../base"
import type { WorkSetPutRequest } from "@/services/worksets"
import type { WorkSet } from "@/types/other"
import {
  type Diff,
  type DiffValue,
  type ExerciseTableData,
  ExerciseUpdateType,
} from "@/types/exercise"
import { deepClone } from "@/utils/tranformators"
import { ExerciseService, type ExercisePutRequest } from "@/services/exercise"
import { ExerciseUpdate } from "./exerciseBase"

export class SingleExerciseTableUpdate extends ExerciseUpdate implements ChangeEvent {
  private changedKey: keyof WorkSet
  private id: number
  private idKey: keyof ExerciseTableData
  private oldValue: DiffValue
  private newValue: DiffValue
  private service: WorkSetService | ExerciseService

  constructor(
    diff: Diff,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    super(exercises, exercisesOld)
    switch (diff.updateType) {
      case ExerciseUpdateType.WorkSet:
        this.service = new WorkSetService()
        break
      case ExerciseUpdateType.Exercise:
        this.service = new ExerciseService()
        break
      default:
        throw new Error("not possible")
    }
    this.id = diff.id
    this.idKey = diff.idKey
    this.changedKey = diff.changedKey as keyof WorkSet
    this.newValue = diff.newValue
    this.oldValue = diff.oldValue
  }

  private adjustExercises(initial: boolean, changedValue: DiffValue) {
    const newRow = this.exercises.find((etd) => etd[this.idKey] === this.id)
    if (!newRow) return Promise.reject(new Error("No row found for diff id"))

    if (!initial) newRow[this.changedKey] = changedValue
    this.exercisesOld.set(newRow.work_set_id, deepClone(newRow))
  }

  private async adjustValue(initial: boolean, changedValue: DiffValue): Promise<void> {
    const request: WorkSetPutRequest | ExercisePutRequest = {
      id: this.id,
    }
    request[this.changedKey] = changedValue
    return this.service.put(request).finally(() => this.adjustExercises(initial, changedValue))
  }

  async up(initial: boolean): Promise<void> {
    this.adjustValue(initial, this.newValue)
  }

  async down(): Promise<void> {
    this.adjustValue(false, this.oldValue)
  }
}
