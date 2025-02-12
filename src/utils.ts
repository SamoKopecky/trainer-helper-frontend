import type { WorkSet, WorkSetPutRequest } from "./backend-helpers/worksets"

export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function workSetDiff(newObj: WorkSet, oldObj: WorkSet): WorkSetPutRequest | null {
  const res: Partial<WorkSetPutRequest> = {}

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      res[key] = newObj[key]
    }
  }

  if (Object.keys(res).length > 0) {
    res["id"] = newObj.id
    return res as WorkSetPutRequest
  }
  return null
}
