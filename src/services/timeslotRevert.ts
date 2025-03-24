import { ServiceI, Method, Route } from "./base"

export interface TimeslotRevertPutRequest {
  id: number
}

export class TimeslotRevertService extends ServiceI {
  route = Route.TimeslotRevert

  async put(body: TimeslotRevertPutRequest): Promise<void> {
    return this.handleRequest({ body, method: Method.PUT })
  }
}
