import { ServiceI, Route, Method } from "./base"
import type { Person } from "../types/other"

export class PersonService extends ServiceI {
  route = Route.Person

  async get(): Promise<Person[]> {
    return this.handleRequest({ method: Method.GET }) as Promise<Person[]>
  }
}
