import { parse } from "date-fns";
import type { ParsedBook } from "../types";
import type { NewHighlight } from "@/lib/db/types";

const HIGHLIGHT_BREAK = "-------------------";

function cleanText(text: string): string {
  return text.replace(/\n/g, " ").replace(/\xa0/g, " ").trim();
}

function extractBookInfo(firstLine: string) {
  const titleStart = firstLine.indexOf("<<");
  const titleEnd = firstLine.indexOf(">>");
  if (titleStart < 0 || titleEnd < titleStart) {
    throw new Error("Invalid Boox annotations header.");
  }
  return {
    bookTitle: cleanText(firstLine.slice(titleStart + 2, titleEnd)),
    bookAuthor: cleanText(firstLine.slice(titleEnd + 2)),
  };
}

function getQuoteDateISO(lines: string[], start: number): string {
  const separator = lines[start].indexOf("|");
  if (separator < 0) throw new Error("Invalid Boox highlight date.");
  const dateString = lines[start].slice(0, separator - 1).trim();
  const date = parse(dateString, "yyyy-MM-dd HH:mm", new Date());
  if (Number.isNaN(date.getTime())) throw new Error("Invalid Boox highlight date.");
  return date.toISOString();
}

function extractHighlights(lines: string[]): NewHighlight[] {
  const highlights: NewHighlight[] = [];
  let start: number | null = null;
  lines.forEach((line, index) => {
    if (/^\d{4}-\d{2}-\d{2}/.test(line) && start === null) start = index;
    else if (line.trim() === HIGHLIGHT_BREAK && start !== null) {
      const quote = cleanText(lines.slice(start + 1, index).join(" "));
      if (quote) highlights.push({ starred: false, quote, date: getQuoteDateISO(lines, start), lastReviewed: null });
      start = null;
    }
  });
  return highlights;
}

export function parseBooxText(content: string): ParsedBook {
  const lines = content.split("\n");
  if (!lines[0]?.trim()) throw new Error("Boox annotations file is empty.");
  const { bookTitle, bookAuthor } = extractBookInfo(lines[0]);
  return { bookTitle, bookAuthor, highlights: extractHighlights(lines) };
}

export function parseBooxFile(file: File): Promise<ParsedBook> {
  return file.text().then(parseBooxText);
}
