export interface Timeslot {
  id: string
  trainer_id: string
  user_id: string
  duration: number
  start: Date
}

export async function getTimeslots(): Promise<Timeslot[]> {
  const api_url = "http://localhost:3000/timeslots"
  const request = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      start_date: "2025-01-20T12:00:00",
      end_date: "2025-02-28T20:15:00",
    }),
  }
  const jsonRes = await (await fetch(api_url, request)).json()
  return jsonRes as Timeslot[]
}
