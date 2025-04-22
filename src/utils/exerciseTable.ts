import { type ExerciseTableColumn, type ExerciseTableData } from "@/types/exercise"

export function getColumns(
  columns: ExerciseTableColumn[],
  row: ExerciseTableData,
): ExerciseTableColumn[] {
  if (!row.is_main) {
    return columns.filter((row) => !row.is_multirow)
  }
  return columns
}

export function getRowspan(row: ExerciseTableData, column: ExerciseTableColumn): number {
  if (row.is_main && column.is_multirow) {
    return row.work_set_count_display
  }
  return 1
}

export function range(x: number): number[] {
  const res = Array(x + 1)
    .fill(1)
    .map((x, y) => x + y)
  return res
}

export function getAllGroupIds(exercises: ExerciseTableData[]): number[] {
  if (exercises.length === 0) {
    return []
  }
  const maxGroupId = Math.max(...exercises.map((e) => e.group_id))
  return Array.from(new Set(range(maxGroupId)).values())
}

export function sortRows(a: ExerciseTableData, b: ExerciseTableData): number {
  if (a.group_id !== b.group_id) {
    return a.group_id - b.group_id
  }

  if (a.exercise_id !== b.exercise_id) {
    return a.exercise_id - b.exercise_id
  }

  if (a.is_main !== b.is_main) {
    return a.is_main ? -1 : 1
  }

  return a.work_set_id - b.work_set_id
}

export function groupBy<T>(list: ExerciseTableData[], keyGetter: (data: ExerciseTableData) => T) {
  const map: Map<T, ExerciseTableData[]> = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}
