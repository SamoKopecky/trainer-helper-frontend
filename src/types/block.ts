export interface Labeled {
  label: number
  id: number
  user_id: string
}

export interface Block extends Labeled {
  weeks: Week[]
}

export interface Week extends Labeled {
  startDate: Date
}

export interface BlockValue extends Omit<Block, "weeks"> {
  weeks: Map<number, Week>
}
export type BlockMap = Map<number, BlockValue>
