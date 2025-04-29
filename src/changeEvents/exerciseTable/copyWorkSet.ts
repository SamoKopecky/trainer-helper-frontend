import type { ExerciseTableData } from "@/types/exercise"
import type { ChangeEvent } from "../base"
import { ExerciseUpdate } from "./exerciseBase"
import { WorkSetService } from "@/services/worksets"
import { deepClone, tableDataToWorkSet } from "@/utils/tranformators"

export class CopyWorkSetExerciseTableUpdate extends ExerciseUpdate implements ChangeEvent {
  private row: ExerciseTableData
  private rowKey: string
  private previousExercises: Map<number, ExerciseTableData> = new Map()
  private service: WorkSetService

  constructor(
    row: ExerciseTableData,
    rowKey: string,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    super(exercises, exercisesOld)
    this.row = row
    this.rowKey = rowKey
    this.service = new WorkSetService()
  }

  private callApi(exercises: ExerciseTableData[]): Promise<void> {
    return this.service.putMany(
      exercises.map((e) => {
        const ws = tableDataToWorkSet(e)
        return {
          id: ws.id,
          intensity: ws.intensity,
          reps: ws.reps,
          rpe: ws.rpe,
        }
      }),
    )
  }

  async up(_initial: boolean): Promise<void> {
    const newExercises: ExerciseTableData[] = []
    this.exercises.forEach((e) => {
      if (e.exercise_id === this.row.exercise_id) {
        this.previousExercises.set(e.work_set_id, deepClone(e))

        e[this.rowKey] = this.row[this.rowKey]
        this.exercisesOld.set(e.work_set_id, deepClone(e))
        newExercises.push(e)
      }
    })

    return this.callApi(newExercises)
  }

  async down(): Promise<void> {
    this.exercises.forEach((e) => {
      if (e.exercise_id === this.row.exercise_id) {
        e[this.rowKey] = this.previousExercises.get(e.work_set_id)![this.rowKey]
        this.exercisesOld.set(e.work_set_id, deepClone(e))
      }
    })

    return this.callApi(Array.from(this.previousExercises.values()))
  }
}
