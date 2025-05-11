import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND ?? "http://localhost:2001"
export enum Route {
  Timeslots = "/timeslots",
  // TODO: Make exercise a subpath of timeslot
  Exercises = "/exercises",
  ExercisesCount = `${Route.Exercises}/count`,
  ExercisesDuplicate = `${Route.Exercises}/duplicate`,
  WorkSets = "/work-sets",
  Users = "/users",
  ExerciseTypes = "/exercise-types",
  ExerciseTypesDuplicate = `${Route.ExerciseTypes}/duplicate`,
  Blocks = "/blocks",
  Weeks = "/weeks",
  WeekDays = "/week-days",
}

export enum Method {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  DELETE = "DELETE",
}

export abstract class ServiceBase<PutObj extends object, PostObj extends object, T extends object> {
  protected route: Route

  constructor(routeBase: Route) {
    this.route = routeBase
  }

  protected get_api_url(route: string) {
    return `${API_BASE_URL}${route}`
  }
  protected get_headers() {
    return { "Content-Type": "application/json" }
  }

  public async post(jsonParams: PostObj): Promise<T> {
    return this.handleRequest({
      jsonParams,
      method: Method.POST,
      route: this.route,
    }) as Promise<T>
  }

  public async put(jsonParams: PutObj): Promise<void> {
    return this.handleRequest({
      jsonParams,
      method: Method.PUT,
      route: this.route,
    }) as Promise<void>
  }

  public async delete(id: number | string): Promise<void> {
    return this.handleRequest({
      pathParams: { id: id },
      method: Method.DELETE,
      route: `${this.route}/:id`,
    }) as Promise<void>
  }

  public async postUndelete(id: number): Promise<void> {
    return this.handleRequest({
      pathParams: { id: id },
      method: Method.POST,
      route: `${this.route}/undelete/:id`,
    }) as Promise<void>
  }

  async handleRequest<
    JsonParamsT extends object,
    PathParamsT extends object,
    QueryParamsT extends object,
    ResponseT,
  >({
    method,
    pathParams,
    queryParams,
    jsonParams,
    toRes = (obj) => obj as ResponseT,
    route,
  }: {
    method: Method
    jsonParams?: JsonParamsT
    queryParams?: QueryParamsT
    pathParams?: PathParamsT
    toRes?: (obj: any) => ResponseT
    route: string
  }): Promise<ResponseT | void> {
    let url = this.get_api_url(route)
    if (pathParams) url = replacePathParams(url, pathParams)
    if (queryParams) url = addQueryParams(url, queryParams)

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

export function replacePathParams<T extends object>(url: string, params: T): string {
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key])
  })
  return url
}

export function addQueryParams<T extends object>(url: string, params: T): string {
  const urlObj = new URL(url)
  Object.keys(params).forEach((key) => {
    urlObj.searchParams.append(key, params[key])
  })

  return urlObj.toString()
}
