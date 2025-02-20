import { SetType, type ExerciseTableData } from "./types"

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
    set_type: SetType.Squat,
    note: note ?? "test",
    is_main: true,
    group_id: 1,
    exercise_id: 1,
    work_set_count: 4,
  }
}
