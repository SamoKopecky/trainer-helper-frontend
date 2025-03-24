import { test, expect } from "vitest"
import { getISODateString } from "./date"

test("getISODateString", () => {
  const date = new Date("2025-03-08T12:00:00")
  expect(getISODateString(date)).toEqual("2025-03-08T11:00:00Z")
})
