import type { ExerciseResponse } from "@/services/exercise"
import type { AppTimeslot } from "@/types/calendar"
import type { ExerciseTableData } from "@/types/exercises"
import type { Timeslot, WorkSet, WorkSetModel } from "@/types/other"
import { EMPTY_USER } from "@/constants"

export function deepClone(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

export function responseToTableData(response: ExerciseResponse): ExerciseTableData[] {
  return response.work_sets.map(
    (work_set: WorkSet, index: number): ExerciseTableData => ({
      ...work_set,
      is_main: index === 0,
      note: response.note,
      group_id: response.group_id,
      set_type: response.set_type,
      exercise_id: response.exercise_id,
      work_set_count: response.work_set_count,
      // Needs to be updated manually
      work_set_count_display: response.work_set_count,
    }),
  )
}

export function tableDataToWorkSet(data: ExerciseTableData): WorkSet {
  return {
    work_set_id: data.work_set_id,
    rpe: data.rpe,
    reps: data.reps,
    intensity: data.intensity,
  }
}

export function mergeTableDataAndWorkSetModel(
  tableRow: ExerciseTableData,
  work_set: WorkSetModel,
  is_main: boolean,
  count: number,
): ExerciseTableData {
  return {
    ...work_set,
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
    title: timeslot.person_name?.toString() ?? EMPTY_USER,
    start: new Date(timeslot.start),
    end: new Date(timeslot.end),
    class: isAssigned ? "assigned" : "no-user",
  }
}
