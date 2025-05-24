import type { ExerciseResponse } from "@/services/exercise"
import type { AppTimeslot } from "@/types/calendar"
import type { ExerciseTableData } from "@/types/exercise"
import type { ExerciseType, ExerciseTypeTableRow } from "@/types/exerciseType"
import type { EnhancedTimeslot, WorkSet } from "@/types/other"
import { getTimeslotUserName } from "./user"
import type { Block, BlockMap, BlockValue, DisplayWeekDay, Week, WeekDay } from "@/types/block"
import { getDateWeekDayString } from "./date"

export function deepClone(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

export function responseToTableData(response: ExerciseResponse): ExerciseTableData[] {
  return response.work_sets.map(
    (work_set: WorkSet, index: number): ExerciseTableData => ({
      work_set_id: work_set.id,
      week_day_id: response.week_day_id,
      reps: work_set.reps,
      intensity: work_set.intensity,
      rpe: work_set.rpe,
      is_main: index === 0,
      note: response.note,
      group_id: response.group_id,
      exercise_type_id: response.exercise_type_id,
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
): ExerciseTableData {
  return {
    exercise_id: work_set.exercise_id,
    week_day_id: tableRow.week_day_id,
    work_set_id: work_set.id,
    reps: work_set.reps,
    intensity: work_set.intensity,
    rpe: work_set.rpe,
    note: tableRow.note,
    group_id: tableRow.group_id,
    exercise_type_id: tableRow.exercise_type_id,
    is_main: false,
    work_set_count: tableRow.work_set_count,
    work_set_count_display: tableRow.work_set_count_display,
  }
}

export function timeslotToAppTimeslot(timeslot: EnhancedTimeslot): AppTimeslot {
  const isAssigned = timeslot.user?.name ?? false
  return {
    ...timeslot,
    title: getTimeslotUserName(timeslot),
    content: timeslot.week_day?.name,
    start: new Date(timeslot.start),
    end: new Date(timeslot.end),
    class: isAssigned ? "assigned" : "no-user",
  }
}

export function exerciseTypeToRow(exerciseType: ExerciseType): ExerciseTypeTableRow {
  const hasMedia = Boolean(exerciseType.youtube_link)
  return {
    name: exerciseType.name,
    mediaType: exerciseType.media_type,
    hasMedia: hasMedia,
    hasMediaVal: hasMedia ? "Yes" : "No",
    id: exerciseType.id,
  }
}

export function blocksToMap(blocks: Block[]): BlockMap {
  const blocksMap: BlockMap = new Map()
  blocks.forEach((b) => {
    const weeksMap: Map<number, Week> = new Map()
    b.weeks.forEach((w) => {
      weeksMap.set(w.id, w)
    })

    const blockValue: BlockValue = {
      label: b.label,
      weeks: weeksMap,
      user_id: b.user_id,
      id: b.id,
    }
    blocksMap.set(b.id, blockValue)
  })
  return blocksMap
}

export function blockToBlockValue(block: Block): BlockValue {
  return {
    label: block.label,
    user_id: block.user_id,
    id: block.id,
    weeks: new Map(),
  }
}

export function weekDayToDisplayWeekDay(weekDay: WeekDay): DisplayWeekDay {
  return {
    ...weekDay,
    day_string: getDateWeekDayString(weekDay.day_date),
    is_created: true,
  }
}

export function exerciseResponsesToMap(
  exercises: ExerciseResponse[],
): Map<number, ExerciseResponse[]> {
  const result: Map<number, ExerciseResponse[]> = new Map()
  if (!exercises) return result

  exercises.forEach((e) => {
    if (result.has(e.week_day_id)) {
      const exercises = result.get(e.week_day_id)
      exercises?.push(e)
    } else {
      result.set(e.week_day_id, [e])
    }
  })
  return result
}
