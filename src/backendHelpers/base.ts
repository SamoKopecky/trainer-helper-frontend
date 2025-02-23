const API_BASE_URL = "http://localhost:3000"

export enum Route {
  Timeslot = "timeslot",
  WorkSet = "workset",
  Exercise = "exercise",
  ExerciseCount = "exercise-count",
}

export abstract class BackendConnector {
  abstract route: Route
  abstract obj_to_response<Response>(obj: unknown): Response

  protected get_api_url() {
    return `${API_BASE_URL}/${this.route}`
  }
  protected get_headers() {
    return new Headers({ "Content-Type": "application/json" })
  }

  async post<Request, Response>(body: Request): Promise<Response[]> {
    const request = {
      method: "POST",
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    const jsonRes: unknown[] = await (await fetch(this.get_api_url(), request)).json()
    return jsonRes.map((obj: unknown): Response => this.obj_to_response(obj))
  }

  async put<Request, Response>(body: Request): Promise<Response> {
    const request = {
      method: "PUT",
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    await fetch(this.get_api_url(), request).then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Put error status: ${response.status} and text: ${response.statusText}`)
      }
      return new Promise(() => {})
    })
  }
}
