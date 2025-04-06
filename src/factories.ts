import { type ExerciseTableData, exerciseType } from "./types/exercises"

export function workSetFactory({
  work_set_id,
  intensity = null,
  note = null,
}: {
  work_set_id: number
  intensity?: string | null
  note?: string | null
}): ExerciseTableData {
  return {
    work_set_id: work_set_id,
    rpe: 7,
    intensity: intensity ?? "105Kg",
    reps: 2,
    exercise_type: exerciseType.Squat,
    note: note ?? "test",
    is_main: true,
    group_id: 1,
    exercise_id: 1,
    work_set_count: 4,
    work_set_count_display: 4,
  }
}
