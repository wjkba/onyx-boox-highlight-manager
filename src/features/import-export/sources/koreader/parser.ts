import type { NewHighlight } from "@/lib/db/types";
import type { ParsedBook } from "../types";

type KoReaderEntry = { text?: unknown; time?: unknown };
type KoReaderDocument = {
  entries?: unknown;
  title?: unknown;
  author?: unknown;
};

const cleanText = (text: string) => text.replace(/\n/g, " ").replace(/\xa0/g, " ").trim();

function filenameMetadata(fileName = "") {
  const name = fileName.split(/[\\/]/).pop()?.replace(/\.json$/i, "") ?? "";
  const withoutTimestamp = name.replace(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\s+/, "");
  const parts = withoutTimestamp.split(" - ").map((part) => part.trim());
  return parts.length >= 2
    ? { bookAuthor: parts[0], bookTitle: parts.slice(1).join(" - ") }
    : { bookAuthor: "", bookTitle: withoutTimestamp };
}

function dateFromSeconds(value: unknown): string {
  // KOReader stores Unix seconds. An absent/bad timestamp is retained as the
  // Unix epoch rather than making an otherwise valid export unusable.
  const seconds = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(seconds)) return new Date(0).toISOString();
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

export function parseKoreaderText(content: string, fileName?: string): ParsedBook {
  let document: KoReaderDocument;
  try {
    document = JSON.parse(content) as KoReaderDocument;
  } catch {
    throw new Error("Invalid KOReader JSON file.");
  }
  if (!document || typeof document !== "object" || !Array.isArray(document.entries) || document.entries.length === 0) {
    throw new Error("KOReader JSON must contain a nonempty entries array.");
  }

  const fallback = filenameMetadata(fileName);
  const bookTitle = typeof document.title === "string" && document.title.trim() ? document.title.trim() : fallback.bookTitle;
  const bookAuthor = typeof document.author === "string" && document.author.trim() ? document.author.trim() : fallback.bookAuthor;
  const highlights: NewHighlight[] = [];
  for (const entry of document.entries as KoReaderEntry[]) {
    if (!entry || typeof entry !== "object" || typeof entry.text !== "string") continue;
    const quote = cleanText(entry.text);
    if (!quote) continue;
    highlights.push({ quote, date: dateFromSeconds(entry.time), starred: false, lastReviewed: null });
  }
  return { bookTitle, bookAuthor, highlights };
}

export function parseKoreaderFile(file: File): Promise<ParsedBook> {
  return file.text().then((content) => parseKoreaderText(content, file.name));
}
