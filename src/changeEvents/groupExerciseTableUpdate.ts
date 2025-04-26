import { ExerciseService } from "@/services/exercise"
import type { ExerciseTableData, DiffNumber } from "@/types/exercise"
import type { ChangeEvent } from "./base"
import { deepClone } from "@/utils/tranformators"
import { sortRows } from "@/utils/exerciseTable"

export class GroupExerciseTableUpdate implements ChangeEvent {
  private id: number
  private oldValue: number
  private newValue: number
  private service: ExerciseService
  private exercises: ExerciseTableData[]
  private exercisesOld: Map<number, ExerciseTableData>

  constructor(
    diff: DiffNumber,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    this.service = new ExerciseService()
    this.id = diff.id
    this.newValue = diff.newValue
    this.oldValue = diff.oldValue
    this.exercises = exercises
    this.exercisesOld = exercisesOld
  }

  private adjustValue(changedValue: number) {
    this.service.put({ id: this.id, group_id: changedValue }).then(() => {
      this.exercises
        .filter((e) => e.exercise_id === this.id)
        .forEach((e) => {
          e.group_id = changedValue
          this.exercisesOld.set(e.work_set_id, deepClone(e))
        })
      this.exercises.sort((a, b) => sortRows(a, b))
    })
  }

  async up(_initial: boolean): Promise<void> {
    this.adjustValue(this.newValue)
  }
  async down(): Promise<void> {
    this.adjustValue(this.oldValue)
  }
}
