const API_BASE_URL = "http://localhost:3000"

export enum Route {
  Timeslot = "timeslots",
  WorkSet = "worksets",
  Exercise = "exercises",
}

export abstract class BackendConnector<PostRequestType, ReponseType, PutRequestType> {
  abstract route: Route
  abstract obj_to_response(obj: unknown): ReponseType

  protected get_api_url() {
    return `${API_BASE_URL}/${this.route}`
  }
  protected get_headers() {
    return new Headers({ "Content-Type": "application/json" })
  }

  async post(body: PostRequestType): Promise<ReponseType[]> {
    const request = {
      method: "POST",
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    const jsonRes: unknown[] = await (await fetch(this.get_api_url(), request)).json()
    return jsonRes.map((obj: unknown): ReponseType => this.obj_to_response(obj))
  }

  async put(body: PutRequestType): Promise<void> {
    const request = {
      method: "PUT",
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    await fetch(this.get_api_url(), request).then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Put error status: ${response.status} and text: ${response.statusText}`)
      }
      return
    })
  }
}
