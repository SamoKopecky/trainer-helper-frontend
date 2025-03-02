import { SetType, type ExerciseTableColumn, type ExerciseTableData } from "../types"

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
  if (x === 0) {
    return []
  }
  const res = Array(x)
    .fill(1)
    .map((x, y) => x + y)
  res.splice(0, 0, 0)
  return res
}

export function generateGroupIds(exercises: ExerciseTableData[]): number[] {
  const maxGroupId = Math.max(...exercises.map((e) => e.group_id))
  return Array.from(new Set(range(maxGroupId)).values())
}

export function generateSetTypes(): string[] {
  return Array.from(
    new Set(Object.values(SetType).filter((type) => type !== SetType.None)).values(),
  )
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
