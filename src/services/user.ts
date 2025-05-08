import { ServiceBase, Route, Method } from "./base"
import { type User } from "@/types/user"

export interface UserPostRequest {
  email: string
  username: string
}

export interface UserDeleteRequest {
  id: string
}

export interface UserPutRequest {
  id: string
  nickname: string
}

export class UserService extends ServiceBase<UserPostRequest, { user_id: string }> {
  public postUndelete(_id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
  route = Route.Users

  async get(): Promise<User[]> {
    return this.handleRequest({ method: Method.GET, route: Route.Users }) as Promise<User[]>
  }

  async post(body: UserPostRequest): Promise<{ user_id: string }> {
    return this.handleRequest({
      method: Method.POST,
      jsonParams: body,
      route: Route.Users,
    }) as Promise<{
      user_id: string
    }>
  }

  async delete(body: UserDeleteRequest): Promise<void> {
    return this.handleRequest({
      method: Method.DELETE,
      jsonParams: body,
      route: Route.Users,
    }) as Promise<void>
  }

  async put(body: UserPutRequest): Promise<void> {
    return this.handleRequest({
      method: Method.PUT,
      jsonParams: body,
      route: Route.Users,
    }) as Promise<void>
  }
}
