const API_BASE_URL = import.meta.env.VITE_APP_BACKEND ?? "http://localhost:2001"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"

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
    return { "Content-Type": "application/json" }
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
    if (!url) {
      url = this.get_api_url()
    }

    const request: AxiosRequestConfig = {
      method: method.toString().toLowerCase(),
      headers: this.get_headers(),
      data: JSON.stringify(body),
      url: url,
    }

    return axios(request)
      .then((response: AxiosResponse) => {
        return toRes(response.data)
      })
      .catch((error: AxiosError) => {
        // TODO: make user friendly
        return Promise.reject(
          Error(`Error status: ${error.status} and text: ${error.response?.statusText}`),
        )
      })
  }
}

export function tokenInterceptor() {
  axios.interceptors.request.use(
    (config) => {
      const keycloak = useKeycloak()
      if (keycloak.authenticated) {
        config.headers.Authorization = `Bearer ${keycloak.token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )
}
