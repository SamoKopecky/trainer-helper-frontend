import { test, expect } from "vitest"
import { addQueryParams, replacePathParams } from "./base"

test("replacePathParams", () => {
  const url = "/path/:id"
  const pathParams = { id: "1" }

  const result = replacePathParams(url, pathParams)

  expect(result).toEqual("/path/1")
})

test("addQueryParams", () => {
  const url = "https://foo.bar/path"
  const pathParams = { foo: "abc", bar: "def" }

  const result = addQueryParams(url, pathParams)

  expect(result).toEqual("https://foo.bar/path?foo=abc&bar=def")
})
