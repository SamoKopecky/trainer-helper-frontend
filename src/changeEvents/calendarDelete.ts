// import { TimeslotService } from "@/services/timeslots"
// import type { ChangeEvent } from "./base"
// import { getISODateString } from "@/utils/date"
// import type { CalTimeslot } from "@/types/calendar"
//
// export class CalendarDeleteEvent implements ChangeEvent {
//   private timeslot: CalTimeslot
//   private service: TimeslotService
//
//   constructor(timeslot: CalTimeslot) {
//     this.timeslot = timeslot
//     this.service = new TimeslotService()
//   }
//
//   public async up<Timeslot>(): Promise<Timeslot> {
//     return this.service
//       .post({
//         trainer_id: 1,
//         start: getISODateString(this.timeslot.start),
//         end: getISODateString(this.timeslot.end),
//       })
//       .then((res) => {
//         this.timeslotId = res.id
//         return res
//       }) as Promise<Timeslot>
//   }
//
//   public down(): void {
//     if (!this.timeslotId || !this.resolvedTimeslot) {
//       throw new Error("Missing timeslot id")
//     }
//     this.service.delete({ timeslot_id: this.timeslotId }).then(() => {
//       this.resolvedTimeslot?.delete(3)
//     })
//   }
// }
