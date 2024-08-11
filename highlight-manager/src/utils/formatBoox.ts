import { parse } from "date-fns";
import { type Quote, type HighlightType } from "../types/types";

export function formatBoox(
  file: File,
  errorCallback: (message: string) => void
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      try {
        const result = handleFileLoad(reader.result as string);
        resolve(result);
      } catch (error) {
        errorCallback("An unexpected error occurred.");
        reject(error);
      }
    };
    reader.onerror = () => {
      errorCallback("Something went wrong.");
      reject(reader.error);
    };
  });
}

function handleFileLoad(content: string) {
  const lines = content.split("\n");
  return extractHighlightsFromLines(lines);
}

function extractHighlightsFromLines(lines: string[]): HighlightType {
  const highlightBreak = "-------------------";
  let highlightStart: number | null = null;
  let quotes: Quote[] = [];
  const { bookTitle, bookAuthor } = extractBookInfo(lines[0]);

  lines.forEach((line, index) => {
    if (/^\d{4}-\d{2}-\d{2}/.test(line) && highlightStart === null) {
      highlightStart = index;
    } else if (line.trim() === highlightBreak && highlightStart !== null) {
      pushQuote(lines, highlightStart, index, quotes);
      highlightStart = null;
    }
  });

  return { bookTitle, bookAuthor, quotes };
}

function extractBookInfo(firstLine: string): {
  bookTitle: string;
  bookAuthor: string;
} {
  const titleStart = firstLine.indexOf("<<") + 2;
  const titleEnd = firstLine.indexOf(">>");
  const bookTitle = cleanText(firstLine.slice(titleStart, titleEnd));
  const bookAuthor = cleanText(firstLine.slice(titleEnd + 2));
  return { bookTitle, bookAuthor };
}

function pushQuote(
  lines: string[],
  start: number,
  end: number,
  quotes: Quote[]
) {
  const quote = {
    starred: false,
    text: cleanText(lines.slice(start + 1, end).join(" ")),
    date: getQuoteDateISO(lines, start),
    lastReviewed: null,
  };
  quotes.push(quote);
}

function getQuoteDateISO(lines: string[], start: number) {
  const lineWithDate = lines[start];
  const dateStringEnd = lineWithDate.indexOf("|");
  const quoteDateString = lineWithDate.slice(0, dateStringEnd - 1).trim();
  const dateObj = parse(quoteDateString, "yyyy-MM-dd HH:mm", new Date());
  return dateObj.toISOString();
}

function cleanText(text: string): string {
  return text.replace(/\n/g, " ").replace(/\xa0/g, " ").trim();
}
