export interface ChangeEvent {
  up(initial: boolean): Promise<void>
  down(): Promise<void>
}
