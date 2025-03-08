import { test, expect } from "vitest"
import { isoToLocal } from "./date"

test("isoToLocal", () => {
  const isoString = "2025-03-08T12:00:00"
  expect(isoToLocal(isoString)).toEqual(new Date("2025-03-08T13:00:00"))
})
