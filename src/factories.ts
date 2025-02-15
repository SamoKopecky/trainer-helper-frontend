import type { WorkSet } from "./backend-helpers/worksets"

export function workSetFactory(id: number, intensity: string | null): WorkSet {
  return {
    id: id,
    note: "123",
    rpe: 7,
    intensity: intensity ?? "105Kg",
    reps: 2,
    tempo: null,
    set_type: "squat",
    timeslot_id: 1,
    timeslot_index: 1,
  } as WorkSet
}
