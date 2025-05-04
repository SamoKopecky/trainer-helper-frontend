import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND ?? "http://localhost:2001"
export enum Route {
  Timeslots = "/timeslots",
  TimeslotsId = `${Route.Timeslots}/:id`,
  TimeslotsUndelete = `${Route.Timeslots}/undelete`,
  WorkSets = "/work-sets",
  WorkSetsUndelete = `${Route.WorkSets}/undelete`,
  Exercises = "/exercises",
  ExercisesUndelete = `${Route.Exercises}/undelete`,
  ExercisesCount = `${Route.Exercises}/count`,
  ExercisesDuplicate = `${Route.Exercises}/duplicate`,
  Users = "/users",
  ExerciseTypes = "/exercise-types",
  ExerciseTypesDuplicate = `${Route.ExerciseTypes}/duplicate`,
  Blocks = "/blocks",
}

export enum Method {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  DELETE = "DELETE",
}

export abstract class ServiceI {
  protected get_api_url(route: Route) {
    return `${API_BASE_URL}${route}`
  }
  protected get_headers() {
    return { "Content-Type": "application/json" }
  }

  async handleRequest<JsonParamsT extends object, PathParamsT extends object, ResponseT>({
    method,
    pathParams,
    jsonParams,
    url,
    toRes = (obj) => obj as ResponseT,
    route,
  }: {
    method: Method
    jsonParams?: JsonParamsT
    pathParams?: PathParamsT
    toRes?: (obj: unknown) => ResponseT
    url?: string
    route: Route
  }): Promise<ResponseT | void> {
    if (!url) url = this.get_api_url(route)
    if (pathParams) url = replacePathParams(url, pathParams)

    const request: AxiosRequestConfig = {
      method: method.toString().toLowerCase(),
      headers: this.get_headers(),
      data: JSON.stringify(jsonParams),
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

export function replacePathParams<T extends object>(path: string, params: T): string {
  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key])
  })
  return path
}
