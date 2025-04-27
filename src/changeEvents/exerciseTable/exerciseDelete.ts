import { ExerciseService } from "@/services/exercise"
import type { ExerciseTableData } from "@/types/exercise"
import type { ChangeEvent } from "../base"

export class ExerciseExerciseTableDelete implements ChangeEvent {
  private service: ExerciseService
  private exercises: ExerciseTableData[]
  private exercisesOld: Map<number, ExerciseTableData>

  constructor(exercises: ExerciseTableData[], exercisesOld: Map<number, ExerciseTableData>) {
    this.service = new ExerciseService()
    this.exercises = exercises
    this.exercisesOld = exercisesOld
  }

  async up(_initial: boolean): Promise<void> {}
  async down(): Promise<void> {}
}
