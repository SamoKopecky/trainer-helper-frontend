import { createRouter, createWebHistory } from "vue-router"
import CalendarView from "@/views/CalendarView.vue"
import HomeView from "@/views/HomeView.vue"
import TimeslotView from "@/views/TimeslotView.vue"

const routes = [
  { path: "/", component: HomeView, name: "Home" },
  { path: "/calendar", component: CalendarView, name: "Time schedule" },
  { path: "/exercise/:id", component: TimeslotView, name: "Sets", props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
