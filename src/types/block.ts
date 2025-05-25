export interface Labeled {
  label: number
  id: number
  user_id: string
}

export interface Block extends Labeled {
  weeks: Week[]
}

export interface Week extends Labeled {
  start_date: Date
  block_id: number
  note?: string
}

export interface BlockValue extends Omit<Block, "weeks"> {
  weeks: Map<number, Week>
}
export type BlockMap = Map<number, BlockValue>

export interface WeekDay extends WeekBase {
  user_id: string
}

export interface DisplayWeekDay extends WeekBase {
  is_created: boolean
  user_id?: string
  day_string: string
}

export interface WeekBase {
  id: number
  week_id: number
  day_date: Date
  is_deleted: boolean
  name?: string
  timeslot_id?: number
}
