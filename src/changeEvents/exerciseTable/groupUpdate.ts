import type { ExerciseTableData, DiffNumber } from "@/types/exercise"
import type { ChangeEvent } from "../base"
import { deepClone } from "@/utils/tranformators"
import { sortRows } from "@/utils/exerciseTable"
import { ExerciseUpdate } from "./exerciseBase"
import { ExerciseService } from "@/services/exercise"

export class GroupExerciseTableUpdate extends ExerciseUpdate implements ChangeEvent {
  private id: number
  private oldValue: number | null
  private newValue: number | null
  private service: ExerciseService

  constructor(
    diff: DiffNumber,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    super(exercises, exercisesOld)
    this.id = diff.id
    this.newValue = diff.newValue
    this.oldValue = diff.oldValue
    this.service = new ExerciseService()
  }

  private adjustValue(changedValue: number | null) {
    if (!changedValue) return
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
