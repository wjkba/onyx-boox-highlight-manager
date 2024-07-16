export interface HighlightType {
  quote: string;
  bookTitle: string;
  bookAuthor: string;
}

export function formatBoox(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const result = handleFileLoad(reader.result as string); // Optional: You might want to remove this log in production
      resolve(result);
    };
    reader.onerror = () => reject(reader.error);
  });
}

function handleFileLoad(content: string) {
  const lines = content.split("\n");
  return extractHighlightsFromLines(lines);
}

function extractHighlightsFromLines(lines: string[]): HighlightType[] {
  const highlightBreak = "-------------------";
  let highlights: HighlightType[] = [];
  let highlightStart: number | null = null;

  const { bookTitle, bookAuthor } = extractBookInfo(lines[0]);

  lines.forEach((line, index) => {
    if (line.startsWith("2") && highlightStart === null) {
      highlightStart = index;
    } else if (line.trim() === highlightBreak && highlightStart !== null) {
      highlights.push(
        createHighlight(lines, highlightStart, index, bookTitle, bookAuthor)
      );
      highlightStart = null;
    }
  });

  return highlights;
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

function createHighlight(
  lines: string[],
  start: number,
  end: number,
  bookTitle: string,
  bookAuthor: string
): HighlightType {
  const quote = cleanText(lines.slice(start + 1, end).join(" "));
  return { quote, bookTitle, bookAuthor };
}

function cleanText(text: string): string {
  return text.replace(/\n/g, " ").replace(/\xa0/g, " ").trim();
}
