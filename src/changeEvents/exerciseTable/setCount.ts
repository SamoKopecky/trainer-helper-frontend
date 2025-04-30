import type { DiffNumber, ExerciseTableData } from "@/types/exercise"
import type { ChangeEvent } from "../base"
import { ExerciseUpdate } from "./exerciseBase"
import { ExerciseService } from "@/services/exercise"
import { deepClone, mergeTableDataAndWorkSetModel, tableDataToWorkSet } from "@/utils/tranformators"
import { WorkSetService } from "@/services/worksets"
import { sortRows } from "@/utils/exerciseTable"

// TODO: When asigning new count, only the main needs to be assinged
export class SetCountExerciseTableUpdate extends ExerciseUpdate implements ChangeEvent {
  private newValue: number
  private oldValue: number
  private exerciseId: number
  private previousExercises: ExerciseTableData[] = []
  private increase: boolean = false
  private exerciseService: ExerciseService
  private workSetService: WorkSetService

  constructor(
    diff: DiffNumber,
    exercises: ExerciseTableData[],
    exercisesOld: Map<number, ExerciseTableData>,
  ) {
    super(exercises, exercisesOld)
    if (!diff.newValue || !diff.oldValue) {
      throw new Error("old or new values can't be none ")
    }
    this.newValue = diff.newValue
    this.oldValue = diff.oldValue
    this.exerciseId = diff.id
    this.exerciseService = new ExerciseService()
    this.workSetService = new WorkSetService()
  }

  private syncExercises(changedCount: number) {
    this.exercises
      .filter((e) => e.exercise_id === this.exerciseId)
      .forEach((e) => {
        e.work_set_count_display = changedCount
        e.work_set_count = changedCount
        this.exercisesOld.set(e.work_set_id, deepClone(e))
      })
  }

  private decreaseSetCount(changeCount: number) {
    const toDelete = this.previousExercises.map((pe) => pe.work_set_id)
    this.exerciseService.deleteCount({ work_set_ids: toDelete }).then(() => {
      // Loop backwards to delete safely, can't use filter because
      // that creates a new array and we can't replcae the array
      // for some reason
      for (let index = this.exercises.length - 1; index >= 0; index--) {
        const e = this.exercises[index]
        if (toDelete.includes(e.work_set_id)) {
          this.exercisesOld.delete(e.work_set_id)
          this.exercises.splice(index, 1)
        }
      }

      this.syncExercises(changeCount)
    })
  }

  private increaseSetCount(changeCount: number) {
    this.workSetService
      .undeleteMany({ ids: this.previousExercises.map((e) => e.work_set_id) })
      .then(() => {
        this.previousExercises.forEach((e) => {
          this.exercises.push(e)
          this.exercises.sort((a, b) => sortRows(a, b))
          this.syncExercises(changeCount)
        })
      })
  }

  async up(initial: boolean): Promise<void> {
    if (initial) {
      const filteredExercises = this.exercises
        .filter((e) => e.exercise_id === this.exerciseId)
        .sort((e) => e.work_set_id)

      if (this.newValue > this.oldValue) {
        this.increase = true
        const exerciseTemplate = filteredExercises[0]
        this.exerciseService
          .putCount({
            count: this.newValue - this.oldValue,
            work_set_template: tableDataToWorkSet(exerciseTemplate),
          })
          .then((res) => {
            const indexStart = this.exercises.indexOf(exerciseTemplate) + 1
            res.forEach((ws, i) => {
              const newExercise = mergeTableDataAndWorkSetModel(exerciseTemplate, ws)
              this.exercises.splice(indexStart + i, 0, newExercise)
              this.previousExercises.push(newExercise)
            })

            this.syncExercises(this.newValue)
          })
        return
      } else {
        this.increase = false
        this.previousExercises.push(...filteredExercises.slice(0, this.oldValue - this.newValue))
      }
    }

    if (this.increase) {
      this.increaseSetCount(this.newValue)
    } else {
      this.decreaseSetCount(this.newValue)
    }
  }

  async down(): Promise<void> {
    if (this.increase) {
      this.decreaseSetCount(this.oldValue)
    } else {
      this.increaseSetCount(this.oldValue)
    }
  }
}
