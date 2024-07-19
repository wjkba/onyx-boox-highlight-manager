// TODO: Add file check
export type Quote = {
  id?: number;
  text: string;
  starred: boolean;
  date: string;
};

export interface HighlightType {
  bookTitle: string;
  bookAuthor: string;
  quotes: Quote[];
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
  };
  quotes.push(quote);
}

function getQuoteDateISO(lines: string[], start: number) {
  const lineWithDate = lines[start];
  console.log(lineWithDate);
  const dateStringEnd = lineWithDate.indexOf("|");
  const quoteDateString = lineWithDate.slice(0, dateStringEnd - 1);
  const dateObj = new Date(quoteDateString);
  return dateObj.toISOString();
}

function cleanText(text: string): string {
  return text.replace(/\n/g, " ").replace(/\xa0/g, " ").trim();
}
