import { createRouter, createWebHistory } from "vue-router"
import AboutView from "./components/AboutView.vue"
import CalendarView from "./components/CalendarView.vue"
import HomeView from "./components/HomeView.vue"

const routes = [
  { path: "/", component: HomeView, name: "Home" },
  { path: "/about", component: AboutView, name: "About" },
  { path: "/calendar", component: CalendarView, name: "Time schedule" },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
