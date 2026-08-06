import type { NewHighlight } from "@/lib/db/types";

/** The common result produced by every import source. */
export type ParsedBook = {
  bookTitle: string;
  bookAuthor: string;
  highlights: NewHighlight[];
};

export type SourceParser = {
  id: string;
  label: string;
  extensions: readonly string[];
  parseText: (content: string, fileName?: string) => ParsedBook;
  parseFile: (file: File) => Promise<ParsedBook>;
};
