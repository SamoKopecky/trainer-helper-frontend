import { createRouter, createWebHistory } from "vue-router"
import CalendarView from "@/components/CalendarView.vue"
import HomeView from "@/components/HomeView.vue"
import ExerciseView from "@/components/ExerciseView.vue"

const routes = [
  { path: "/", component: HomeView, name: "Home" },
  { path: "/calendar", component: CalendarView, name: "Time schedule" },
  { path: "/exercise/:id", component: ExerciseView, name: "Sets", props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
