import type { ExerciseTableData } from "@/types/exercise"
import type { ChangeEvent } from "../base"
import { ExerciseBase } from "./exerciseBase"
import { WorkSetService } from "@/services/worksets"
import { deepClone, tableDataToWorkSet } from "@/utils/tranformators"

export class CopyWorkSetExerciseTable extends ExerciseBase implements ChangeEvent {
  private row: ExerciseTableData
  private rowKey: string
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
  async up(_initial: boolean): Promise<void> {
    const changedWorkSets = this.exercises.filter((e) => e.exercise_id === this.row.exercise_id)

    changedWorkSets.forEach((e) => {
      e[key] = row[key]
      exercisesOld.set(e.work_set_id, deepClone(e))
    })

    this.service.putMany(
      changedWorkSets.map((ws) => {
        const wsType = tableDataToWorkSet(ws)
        return {
          id: wsType.id,
          intensity: wsType.intensity,
          reps: wsType.reps,
          rpe: wsType.rpe,
        }
      }),
    )
  }

  async down(): Promise<void> {}
}
