export interface ChangeEvent {
  up<T>(): Promise<T>
  down(): void
}
