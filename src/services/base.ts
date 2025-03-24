const API_BASE_URL = import.meta.env.VITE_APP_BACKEND ?? "http://localhost:2001"

export enum Route {
  Timeslot = "/timeslot",
  TimeslotRevert = "/timeslot/revert",
  WorkSet = "/workset",
  Exercise = "/exercise",
  ExerciseCount = "/exercise/count",
  ExerciseDuplicate = "/exercise/duplicate",
  Person = "/person",
}

export enum Method {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  DELETE = "DELETE",
}

export abstract class ServiceI {
  abstract route: Route

  protected get_api_url() {
    return `${API_BASE_URL}${this.route}`
  }
  protected get_headers() {
    return new Headers({ "Content-Type": "application/json" })
  }

  async handleRequest<RequestT, ResponseT>({
    body,
    method,
    toRes = (obj) => obj as ResponseT,
    url,
  }: {
    method: Method
    body?: RequestT
    toRes?: (obj: unknown) => ResponseT
    url?: string
  }): Promise<ResponseT | void> {
    const request = {
      method: method,
      headers: this.get_headers(),
      body: JSON.stringify(body),
    }

    if (!url) {
      url = this.get_api_url()
    }
    const response = await fetch(url, request)

    if (!response.ok) {
      throw new Error(`Error status: ${response.status} and text: ${response.statusText}`)
    }

    if (response.status == 204 || response.headers.get("Content-Length") === "0") {
      return
    }

    const res = toRes(await response.json())

    return res
  }
}
