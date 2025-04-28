import type { ExerciseTableData } from "@/types/exercise"

export class ExerciseBase {
  protected exercises: ExerciseTableData[]
  protected exercisesOld: Map<number, ExerciseTableData>

  constructor(exercises: ExerciseTableData[], exercisesOld: Map<number, ExerciseTableData>) {
    this.exercises = exercises
    this.exercisesOld = exercisesOld
  }
}
