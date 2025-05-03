export interface Block {
  id: number
  user_id: string
  label: number
  weeks: Week[]
}

export interface Week {
  id: number
  user_id: string
  label: number
  startDate: Date
}

export interface BlockValue extends Omit<Block, "weeks"> {
  weeks: Map<number, Week>
}
export type BlockMap = Map<number, BlockValue>
