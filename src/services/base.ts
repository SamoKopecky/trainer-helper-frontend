const API_BASE_URL = import.meta.env.VITE_APP_BACKEND ?? "http://localhost:2001"

export enum Route {
  Timeslot = "timeslot",
  WorkSet = "workset",
  Exercise = "exercise",
  ExerciseCount = "exercise-count",
}

export enum Method {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  DELETE = "DELETE",
}

export abstract class Service {
  abstract route: Route

  protected get_api_url() {
    return `${API_BASE_URL}/${this.route}`
  }
  protected get_headers() {
    return new Headers({ "Content-Type": "application/json" })
  }

  async handleRequest<RequestT, ResponseT>(
    body: RequestT,
    method: Method,
    // TODO: Make sure this is a type guard
    obj_to_response: (obj: unknown) => ResponseT = (obj) => obj as ResponseT,
  ): Promise<ResponseT | void> {
    const request = {
      method: method,
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    const response = await fetch(this.get_api_url(), request)

    if (!response.ok) {
      throw new Error(`Error status: ${response.status} and text: ${response.statusText}`)
    }

    if (response.status == 204 || response.headers.get("Content-Length") === "0") {
      return
    }

    const res = obj_to_response(await response.json())

    return res
  }
}
