import { ServiceBase, Route, Method } from "./base"
import { type User } from "@/types/user"

export interface UserPostRequest {
  email: string
  username: string
}

export interface UserPutRequest {
  id: string
  nickname: string
}

export class UserService extends ServiceBase<UserPutRequest, UserPostRequest, { user_id: string }> {
  constructor() {
    super(Route.Users)
  }

  public postUndelete(_id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async get(): Promise<User[]> {
    return this.handleRequest({ method: Method.GET, route: Route.Users }) as Promise<User[]>
  }
}
