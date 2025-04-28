import type { ExerciseTableData } from "@/types/exercise"
import type { ChangeEvent } from "../base"
import { sortRows } from "@/utils/exerciseTable"
import { deepClone } from "@/utils/tranformators"
import { ExerciseBase } from "./exerciseBase"
import { ExerciseService } from "@/services/exercise"

export class ExerciseExerciseTableDelete extends ExerciseBase implements ChangeEvent {
  private exerciseId: number
  private deletedExercises: ExerciseTableData[] = []
  private service: ExerciseService

  constructor(
    exericseId: number,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    super(exercises, exercisesOld)
    this.exerciseId = exericseId
    this.service = new ExerciseService()
  }

  async up(_initial: boolean): Promise<void> {
    return this.service.delete({ exercise_id: this.exerciseId }).then(() => {
      const deletedExercises: ExerciseTableData[] = []
      // Loop backwards to delete safely, can't use filter because
      // that creates a new array and we can't replcae the array
      // for some reason
      for (let index = this.exercises.length - 1; index >= 0; index--) {
        const e = this.exercises[index]
        if (e.exercise_id === this.exerciseId) {
          deletedExercises.push(e)
          this.exercisesOld.delete(e.work_set_id)
          this.exercises.splice(index, 1)
        }
      }
      this.deletedExercises = deletedExercises
    })
  }

  async down(): Promise<void> {
    return this.service.postUndelete({ id: this.exerciseId }).then(() => {
      if (this.deletedExercises.length === 0) throw new Error("no deleted exercises")
      this.deletedExercises.forEach((de) => {
        this.exercises.push(de)
        this.exercisesOld.set(de.work_set_id, deepClone(de))
      })
      this.exercises.sort((a, b) => sortRows(a, b))
    })
  }
}
