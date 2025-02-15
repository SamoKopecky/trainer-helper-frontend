import { test, expect } from "vitest"
import type { WorkSetPutRequest } from "./backend-helpers/worksets"
import { workSetFactory } from "./factories"
import { workSetDiff } from "./utils"

test("workSetDiff to return diff correctly", () => {
  const newObj = workSetFactory(1, "105Kg")
  const oldObj = workSetFactory(1, "100Kg")

  const diff = workSetDiff(newObj, oldObj) as WorkSetPutRequest

  expect(diff).not.toBeNull()
  expect(Object.keys(diff)).toStrictEqual(["intensity", "id"])
  expect(diff?.id).toBe(1)
  expect(diff?.intensity).toBe("105Kg")
})

test("workSetDiff to return null when no difference", () => {
  const newObj = workSetFactory(1, "105Kg")
  const oldObj = workSetFactory(1, "105Kg")

  const diff = workSetDiff(newObj, oldObj) as WorkSetPutRequest

  expect(diff).toBeNull()
})
