import { ServiceI, Route, Method } from "./base"
import { type User } from "@/types/user"

export class UserService extends ServiceI {
  route = Route.User

  async get(): Promise<User[]> {
    return this.handleRequest({ method: Method.GET }) as Promise<User[]>
  }
}
