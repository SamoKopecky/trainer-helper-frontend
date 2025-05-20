import type { EnhancedTimeslot } from "@/types/other"
import type { VueKeycloakTokenParsed } from "@dsb-norge/vue-keycloak-js"
import type { DeepReadonly } from "vue"

const TRAINER_ID_KEY = "trainer_id"

// TODO: Make class for user
export function isUserTrainer(token: DeepReadonly<VueKeycloakTokenParsed> | undefined): boolean {
  const trainerRegex = /.*trainer_app/
  if (token && token.realm_access) {
    return token.realm_access.roles.some((item) => trainerRegex.test(item))
  }
  return false
}

export function getTrainerIdAttribute(
  token: DeepReadonly<VueKeycloakTokenParsed> | undefined,
): string | undefined {
  if (token) return token[TRAINER_ID_KEY]
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

export function getTimeslotUserName(timeslot: EnhancedTimeslot): string | undefined {
  return timeslot.user?.nickname ?? timeslot.user?.name ?? timeslot.user?.email
}

export function getUserFromEmail(email: string): string | null {
  // TODO: Create class from email
  if (!email.includes("@")) {
    return null
  }
  const parts = email.split("@")
  return parts[0]
}
