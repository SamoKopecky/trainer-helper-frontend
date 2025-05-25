import { isArray } from "../utils/service"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type ResponseType,
} from "axios"

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND ?? "http://localhost:2001"
export enum Route {
  Timeslots = "/timeslots",
  // TODO: Make exercise a subpath of timeslot
  Exercises = "/exercises",
  ExercisesCount = `${Route.Exercises}/count`,
  WorkSets = "/work-sets",
  Users = "/users",
  ExerciseTypes = "/exercise-types",
  ExerciseTypesDuplicate = `${Route.ExerciseTypes}/duplicate`,
  Blocks = "/blocks",
  Weeks = "/weeks",
  WeekDays = "/week-days",
  WeekDaysTimeslots = `${Route.WeekDays}/timeslots`,
  File = "/files",
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

  protected jsonHeaders() {
    return { "Content-Type": "application/json" }
  }

  protected mediaHeaders() {
    return { "Content-Type": "multipart/form-data" }
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
    postBody,
    responseType,
    toRes = (obj) => obj as ResponseT,
    route,
  }: {
    method: Method
    jsonParams?: JsonParamsT
    queryParams?: QueryParamsT
    pathParams?: PathParamsT
    postBody?: FormData
    responseType?: ResponseType
    toRes?: (obj: any) => ResponseT
    route: string
  }): Promise<ResponseT | void> {
    let url = this.get_api_url(route)
    if (pathParams) url = replacePathParams(url, pathParams)
    if (queryParams) url = addQueryParams(url, queryParams)

    let data: any = undefined
    let headers = this.jsonHeaders()
    if (jsonParams) {
      data = JSON.stringify(jsonParams)
      headers = this.jsonHeaders()
    } else if (postBody) {
      data = postBody
      headers = this.mediaHeaders()
    }

    const request: AxiosRequestConfig = {
      method: method.toString().toLowerCase(),
      headers: headers,
      data: data,
      url: url,
    }

    if (responseType) request.responseType = responseType

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
    const paramVal = params[key]
    if (isArray(paramVal)) {
      paramVal.forEach((val) => {
        urlObj.searchParams.append(key, String(val))
      })
    } else {
      urlObj.searchParams.append(key, params[key])
    }
  })

  return urlObj.toString()
}
