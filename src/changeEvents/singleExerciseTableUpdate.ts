import { WorkSetService } from "@/services/worksets"
import type { ChangeEvent } from "./base"
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

export class SingleExerciseTableUpdate implements ChangeEvent {
  private changedKey: keyof WorkSet
  private id: number
  private idKey: keyof ExerciseTableData
  private oldValue: number | string
  private newValue: number | string
  private service: WorkSetService
  private exercises: ExerciseTableData[]
  private exercisesOld: Map<number, ExerciseTableData>

  constructor(
    diff: Diff,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
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
    this.exercises = exercises
    this.exercisesOld = exercisesOld
  }

  private adjustExercises(initial: boolean, changedValue: DiffValue) {
    console.log(this.idKey)
    const newRow = this.exercises.find((etd) => etd[this.idKey] === this.id)
    if (!newRow) return Promise.reject(new Error("No row found for diff id"))

    console.log("new", this.newValue, "old", this.oldValue, "change", changedValue)
    if (!initial) newRow[this.changedKey] = changedValue
    this.exercisesOld.set(this.id, deepClone(newRow))
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
