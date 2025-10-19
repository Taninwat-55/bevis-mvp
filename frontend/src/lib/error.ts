// src/lib/error.ts
export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
) {
  return err instanceof Error ? err.message : fallback;
}
