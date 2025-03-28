import type { ExerciseResponse } from "@/services/exercise"
import type { AppTimeslot } from "@/types/calendar"
import type { ExerciseTableData } from "@/types/exercises"
import type { Timeslot, WorkSet } from "@/types/other"
import { EMPTY_USER } from "@/constants"
import { capitalizeWords } from "./user"

export function deepClone(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

export function responseToTableData(response: ExerciseResponse): ExerciseTableData[] {
  return response.work_sets.map(
    (work_set: WorkSet, index: number): ExerciseTableData => ({
      work_set_id: work_set.id,
      reps: work_set.reps,
      intensity: work_set.intensity,
      rpe: work_set.rpe,
      is_main: index === 0,
      note: response.note,
      group_id: response.group_id,
      set_type: response.set_type,
      exercise_id: response.id,
      work_set_count: response.work_sets.length,
      // Needs to be updated manually
      work_set_count_display: response.work_sets.length,
    }),
  )
}

export function tableDataToWorkSet(data: ExerciseTableData): WorkSet {
  return {
    id: data.work_set_id,
    exercise_id: data.exercise_id,
    rpe: data.rpe,
    reps: data.reps,
    intensity: data.intensity,
  }
}

export function mergeTableDataAndWorkSetModel(
  tableRow: ExerciseTableData,
  work_set: WorkSet,
  is_main: boolean,
  count: number,
): ExerciseTableData {
  return {
    exercise_id: work_set.exercise_id,
    work_set_id: work_set.id,
    reps: work_set.reps,
    intensity: work_set.intensity,
    rpe: work_set.rpe,
    note: tableRow.note,
    group_id: tableRow.group_id,
    set_type: tableRow.set_type,
    is_main: is_main,
    work_set_count: count,
    work_set_count_display: count,
  }
}

export function timeslotToAppTimeslot(timeslot: Timeslot): AppTimeslot {
  const isAssigned = timeslot.person_name
  return {
    ...timeslot,
    title: capitalizeWords(timeslot.person_name?.toString()) ?? EMPTY_USER,
    start: new Date(timeslot.start),
    end: new Date(timeslot.end),
    class: isAssigned ? "assigned" : "no-user",
  }
}
