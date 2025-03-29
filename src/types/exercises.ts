import type { Exercise, WorkSet } from "./other"

export interface ExerciseTableColumn {
  key: string
  type: string | null
  name: string
  is_multirow: boolean
}

export enum ExerciseUpdateType {
  Exercise = "Exercise",
  GroupId = "GroupId",
  WorkSet = "WorkSet",
  WorkSetCount = "WorkSetCount",
}

export enum SetType {
  Squat = "Squat",
  Deadlift = "Deadlift",
  BenchPress = "Bench Press",
  RomanianDeadlift = "RDL",
  CableHorizontalRow = "Cable Horizontal Row",
  HackSquat = "Hack Squat",
  LegPress = "Leg Press",
  CalfRaise = "Calf Raise",
  RingMuscleUp = "Ring Muscle Up",
  PullUp = "Pull Up",
  MachineHipAbduction = "Machine Hip Abduction",
  JeffersonCurl = "Jefferson Curl",
  KettlebellSideBend = "Kettlebell Side Bend",
  MachineChestPress = "Machine Chest Press",
  Multipress = "Multipress",
  Dips = "Dips",
  MachineShoulderPress = "Machine Shoulder Press",
  TricepsPushdown = "Triceps Pushdown",
  BentArmLateralRaise = "Bent Arm Lateral Raise",
  BenchCrunch = "Bench Crunch",
  None = "",
}

export interface Diff {
  id: number
}

export interface ExerciseDiff extends Diff {
  note?: string
  set_type: SetType | null
}

export interface WorkSetDiff extends Diff {
  rpe: number | null
  intensity: string | null
  reps: number | null
}

export interface GroupIdDiff extends Diff {
  group_id?: number
}

export interface WorkSetCountDiff extends Diff {
  work_set_count: number
}

export interface ExerciseTableData extends Omit<WorkSet, "id">, Omit<Exercise, "id"> {
  work_set_id: number
  is_main: boolean
  work_set_count_display: number
}
