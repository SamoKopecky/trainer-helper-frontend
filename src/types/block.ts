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
  week_days: WeekDay[]
}

export interface BlockValue extends Omit<Block, "weeks"> {
  weeks: Map<number, Week>
}
export type BlockMap = Map<number, BlockValue>

export interface WeekDay {
  id: number
  week_id: number
  user_id: string
  day_date: Date
  name?: string
}
