export enum Route {
  Timeslot = "timeslots",
  WorkSet = "worksets",
}

export abstract class BackendConnector<RequestType, ResponseType> {
  abstract route: Route
  abstract obj_to_response(obj: any): ResponseType

  async post(body: RequestType): Promise<ResponseType[]> {
    const api_url = `http://localhost:3000/${this.route}`
    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    }

    const jsonRes: any[] = await (await fetch(api_url, request)).json()
    return jsonRes.map((obj: any): ResponseType => this.obj_to_response(obj))
  }
}
