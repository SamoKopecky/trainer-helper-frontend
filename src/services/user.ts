import { ServiceI, Route, Method } from "./base"
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

export class UserService extends ServiceI {
  route = Route.User

  async get(): Promise<User[]> {
    return this.handleRequest({ method: Method.GET, route: Route.User }) as Promise<User[]>
  }

  async post(body: UserPostRequest): Promise<{ user_id: string }> {
    return this.handleRequest({ method: Method.POST, body: body, route: Route.User }) as Promise<{
      user_id: string
    }>
  }

  async delete(body: UserDeleteRequest): Promise<void> {
    return this.handleRequest({
      method: Method.DELETE,
      body: body,
      route: Route.User,
    }) as Promise<void>
  }

  async put(body: UserPutRequest): Promise<void> {
    return this.handleRequest({
      method: Method.PUT,
      body: body,
      route: Route.User,
    }) as Promise<void>
  }
}
