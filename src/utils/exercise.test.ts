import { test, expect } from "vitest"
import { workSetFactory } from "../factories"
import { tableDataDiff } from "./exercise"
import { ExerciseUpdateType } from "../types"

test("tableDataDiff return diff correctly for work set props", () => {
  const newObj = workSetFactory({ intensity: "105Kg", work_set_id: 1 })
  const oldObj = workSetFactory({ intensity: "100Kg", work_set_id: 1 })

  const [diff, type] = tableDataDiff(newObj, oldObj)

  expect(diff).not.toBeNull()
  expect(Object.keys(diff)).toStrictEqual(["intensity", "id"])
  expect(diff?.id).toBe(1)
  expect(diff?.intensity).toBe("105Kg")
  expect(type).toBe(ExerciseUpdateType.WorkSet)
})

test("tableDataDiff to return diff correctly for exercise props", () => {
  const newObj = workSetFactory({ work_set_id: 1, note: "123" })
  const oldObj = workSetFactory({ work_set_id: 1, note: "456" })

  const [diff, type] = tableDataDiff(newObj, oldObj)

  expect(diff).not.toBeNull()
  expect(Object.keys(diff)).toStrictEqual(["note", "id"])
  expect(diff?.id).toBe(1)
  expect(diff?.note).toBe("123")
  expect(type).toBe(ExerciseUpdateType.Exercise)
})

test("tableDataDiff to return null when no difference", () => {
  const newObj = workSetFactory({ intensity: "105Kg", work_set_id: 1 })
  const oldObj = workSetFactory({ intensity: "105Kg", work_set_id: 1 })

  const [diff, type] = tableDataDiff(newObj, oldObj)

  expect(diff).toBeNull()
  expect(type).toBeNull()
})
