export interface HighlightType {
  bookTitle: string;
  bookAuthor: string;
  quotes: string[];
}

export function formatBoox(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const result = handleFileLoad(reader.result as string);
      resolve(result);
    };
    reader.onerror = () => reject(reader.error);
  });
}

function handleFileLoad(content: string) {
  const lines = content.split("\n");
  return extractHighlightsFromLines(lines);
}

function extractHighlightsFromLines(lines: string[]): HighlightType {
  const highlightBreak = "-------------------";
  let highlightStart: number | null = null;
  let quotes: string[] = [];
  const { bookTitle, bookAuthor } = extractBookInfo(lines[0]);

  lines.forEach((line, index) => {
    if (line.startsWith("2") && highlightStart === null) {
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
  quotes: string[]
) {
  const quote = cleanText(lines.slice(start + 1, end).join(" "));
  quotes.push(quote);
}

function cleanText(text: string): string {
  return text.replace(/\n/g, " ").replace(/\xa0/g, " ").trim();
}
