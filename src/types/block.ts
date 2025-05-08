export interface Labeled {
  label: number
}

export interface Block extends Labeled {
  id: number
  user_id: string
  weeks: Week[]
}

export interface Week extends Labeled {
  id: number
  user_id: string
  startDate: Date
}

export interface BlockValue extends Omit<Block, "weeks"> {
  weeks: Map<number, Week>
}
export type BlockMap = Map<number, BlockValue>
