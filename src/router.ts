import { createRouter, createWebHistory } from "vue-router"
import CalendarView from "@/views/CalendarView.vue"
import HomeView from "@/views/HomeView.vue"
import TimeslotView from "@/views/TimeslotView.vue"
import ExerciseTypeView from "@/views/ExerciseTypeView.vue"
import AthleteListView from "@/views/AthleteListView.vue"
import AthleteView from "@/views/AthleteView.vue"

const routes = [
  { path: "/", component: HomeView, name: "Home" },
  { path: "/calendar", component: CalendarView, name: "Time schedule" },
  { path: "/weekDay/:id", component: TimeslotView, name: "Timeslot", props: true },
  { path: "/exerciseType", component: ExerciseTypeView, name: "Exercise types" },
  { path: "/athleteList", component: AthleteListView, name: "Athletes" },
  { path: "/athlete/:userId?", component: AthleteView, name: "Athlete", props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
