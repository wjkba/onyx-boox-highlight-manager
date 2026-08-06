/** @deprecated Import the Boox parser from features/import-export/sources instead. */
import { parseBooxFile } from "@/features/import-export/sources/boox";

// Kept for existing import screens and third-party callers.
export function formatBoox(file: File, errorCallback: (message: string) => void) {
  return parseBooxFile(file).catch((error: unknown) => {
    errorCallback("An unexpected error occurred.");
    throw error;
  });
}
