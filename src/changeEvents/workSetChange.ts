import { WorkSetService } from "@/services/worksets"
import type { ChangeEvent } from "./base"
import type { WorkSetPutRequest } from "@/services/worksets"
import type { WorkSet } from "@/types/other"
import type { ExerciseTableData } from "@/types/exercise"
import { deepClone } from "@/utils/tranformators"

export class WorkSetChangeEvent<T> implements ChangeEvent {
  private changedKey: keyof WorkSet
  private id: number
  private oldValue: T
  private newValue: T
  private service: WorkSetService
  private exercises: ExerciseTableData[]
  private exercisesOld: Map<number, ExerciseTableData>

  constructor(
    id: number,
    changedKey: keyof WorkSet,
    newValue: T,
    oldValue: T,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    this.service = new WorkSetService()
    this.id = id
    this.changedKey = changedKey
    this.newValue = newValue
    this.oldValue = oldValue
    this.exercises = exercises
    this.exercisesOld = exercisesOld
  }

  private adjustExercises(initial: boolean, changedValue: T) {
    const newRow = this.exercises.find((etd) => etd.work_set_id === this.id)
    if (!newRow) return Promise.reject(new Error("No row found for work set id"))

    if (!initial) newRow[this.changedKey] = changedValue
    this.exercisesOld.set(this.id, deepClone(newRow))
  }

  async up(initial: boolean): Promise<void> {
    const request: WorkSetPutRequest = {
      id: this.id,
    }
    request[this.changedKey] = this.newValue
    return this.service.put(request).finally(() => this.adjustExercises(initial, this.newValue))
  }

  async down(): Promise<void> {
    const request: WorkSetPutRequest = {
      id: this.id,
    }
    request[this.changedKey] = this.oldValue
    return this.service.put(request).finally(() => this.adjustExercises(false, this.oldValue))
  }
}
