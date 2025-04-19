export interface User {
  id: string
  name: string
  nickname: string
  email: string
}

export interface UserTableRow {
  id: number
  name: string
  nickname?: string
}
