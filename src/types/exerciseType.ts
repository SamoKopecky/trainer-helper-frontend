export interface ExerciseType extends ExerciseTypeUpdate {
  id: number
  user_id: string
  name: string
}

export interface ExerciseTypeUpdate {
  note?: string
  media_type?: MediaType
  media_address?: string
}

export interface ExerciseTypeTableRow {
  id: number
  name: string
  hasMedia: boolean
  hasMediaVal: string
  mediaType?: MediaType
}

export enum MediaType {
  Youtube = "YOUTUBE",
  File = "FILE",
}
