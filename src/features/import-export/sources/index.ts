export type { ParsedBook, SourceParser } from "./types";
export { parseBooxFile, parseBooxText } from "./boox";
export { parseKoreaderFile, parseKoreaderText } from "./koreader";

import type { SourceParser } from "./types";
import { parseBooxFile, parseBooxText } from "./boox";
import { parseKoreaderFile, parseKoreaderText } from "./koreader";

/** Registry intentionally contains parsing only; UI can choose how to present it. */
export const importSources: readonly SourceParser[] = [
  { id: "boox", label: "Onyx Boox", extensions: [".txt"], parseText: parseBooxText, parseFile: parseBooxFile },
  { id: "koreader", label: "KOReader", extensions: [".json"], parseText: parseKoreaderText, parseFile: parseKoreaderFile },
];

export const booxSource: SourceParser = importSources[0];
export const koreaderSource: SourceParser = importSources[1];
