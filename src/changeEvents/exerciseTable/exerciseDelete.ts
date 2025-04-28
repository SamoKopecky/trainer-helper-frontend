import { ExerciseService } from "@/services/exercise"
import type { ExerciseTableData } from "@/types/exercise"
import type { ChangeEvent } from "../base"
import { sortRows } from "@/utils/exerciseTable"
import { deepClone } from "@/utils/tranformators"

export class ExerciseExerciseTableDelete implements ChangeEvent {
  private exerciseId: number
  private deletedExercises: ExerciseTableData[] = []
  private service: ExerciseService
  private exercises: ExerciseTableData[]
  private exercisesOld: Map<number, ExerciseTableData>

  constructor(
    exericseId: number,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    this.service = new ExerciseService()
    this.exerciseId = exericseId
    this.exercises = exercises
    this.exercisesOld = exercisesOld
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
