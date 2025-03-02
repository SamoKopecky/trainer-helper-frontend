import { test, expect } from "vitest"
import { range } from "./exerciseTable"

test("range generates range correctly", () => {
  const result = range(3)
  expect(result).toStrictEqual([0, 1, 2, 3])
})

test("range generates range correctly if argument is 0", () => {
  const result = range(0)
  expect(result).toStrictEqual([])
})
