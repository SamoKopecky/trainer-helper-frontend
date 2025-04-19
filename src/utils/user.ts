import { EMPTY_USER } from "@/constants"
import type { Timeslot } from "@/types/other"
import type { VueKeycloakTokenParsed } from "@dsb-norge/vue-keycloak-js"
import type { DeepReadonly } from "vue"

export function isUserTrainer(token: DeepReadonly<VueKeycloakTokenParsed> | undefined): boolean {
  const trainerRegex = /.*trainer_app/
  if (token && token.realm_access) {
    return token.realm_access.roles.some((item) => trainerRegex.test(item))
  }
  return false
}

export function capitalizeWords(str?: string): string | undefined {
  if (!str) {
    return str
  }
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function getTimeslotUserName(timeslot: Timeslot): string {
  return timeslot.user_nickname ?? timeslot.user_name ?? EMPTY_USER
}
