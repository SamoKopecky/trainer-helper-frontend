const API_BASE_URL = "http://localhost:3000"

export enum Route {
  Timeslot = "timeslots",
  WorkSet = "worksets",
}

export abstract class BackendConnector<RequestType, PostResponseType, PutResponseType> {
  abstract route: Route
  abstract obj_to_response(obj: any): PostResponseType

  private get_api_url() {
    return `${API_BASE_URL}/${this.route}`
  }
  private get_headers() {
    return new Headers({ "Content-Type": "application/json" })
  }

  async post(body: RequestType): Promise<PostResponseType[]> {
    const request = {
      method: "POST",
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    const jsonRes: any[] = await (await fetch(this.get_api_url(), request)).json()
    return jsonRes.map((obj: any): PostResponseType => this.obj_to_response(obj))
  }

  async put(body: PutResponseType) {
    const request = {
      method: "PUT",
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    // TODO: Work with status codes
    await fetch(this.get_api_url(), request)
  }
}
