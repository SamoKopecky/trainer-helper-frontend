export interface ChangeEvent {
  up(): Promise<void>
  down(): Promise<void>
}
