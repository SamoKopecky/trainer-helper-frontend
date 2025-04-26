import { WorkSetService } from "@/services/worksets"
import type { ChangeEvent } from "./base"
import type { WorkSetPutRequest } from "@/services/worksets"
import type { WorkSet } from "@/types/other"
import { type Diff, type ExerciseTableData, ExerciseUpdateType } from "@/types/exercise"
import { deepClone } from "@/utils/tranformators"
import { ExerciseService, type ExercisePutRequest } from "@/services/exercise"

export class SingleExerciseTableUpdate implements ChangeEvent {
  private changedKey: keyof WorkSet
  private id: number
  private idKey: keyof ExerciseTableData
  private oldValue: any
  private newValue: any
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

  private adjustExercises(initial: boolean, changedValue: any) {
    const newRow = this.exercises.find((etd) => etd[this.idKey] === this.id)
    if (!newRow) return Promise.reject(new Error("No row found for work set id"))

    if (!initial) newRow[this.changedKey] = changedValue
    this.exercisesOld.set(this.id, deepClone(newRow))
  }

  async up(initial: boolean): Promise<void> {
    const request: WorkSetPutRequest | ExercisePutRequest = {
      id: this.id,
    }
    request[this.changedKey] = this.newValue
    return this.service.put(request).finally(() => this.adjustExercises(initial, this.newValue))
  }

  async down(): Promise<void> {
    const request: WorkSetPutRequest | ExercisePutRequest = {
      id: this.id,
    }
    request[this.changedKey] = this.oldValue
    return this.service.put(request).finally(() => this.adjustExercises(false, this.oldValue))
  }
}
