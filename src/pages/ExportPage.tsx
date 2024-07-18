import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { Layout } from "../Layout";
import { useRef } from "react";
import { saveAs } from "file-saver";

export default function ExportPage() {
  const books = useLiveQuery(() => db.highlights.toArray());
  const selectRef = useRef<HTMLSelectElement>(null);

  async function handleExport() {
    if (selectRef.current) {
      const selectedBookTitle = selectRef.current?.value;
      const book = books!.find((book) => book.bookTitle === selectedBookTitle);
      if (book) {
        const highlights = book.quotes.map((quote) => `- ${quote.text}\n`);
        const markdownContent = [
          "# Book info",
          `Author: ${book.bookAuthor}\n`,
          `Title: ${book.bookTitle}\n`,
          "",
          "# Highlights",
          ...highlights,
        ].join("\n");
        const blob = new Blob([markdownContent], {
          type: "text/markdown;charset=utf-8",
        });
        saveAs(blob, `${selectedBookTitle} - Highlights.md`);
      }
    }
  }

  if (books && books.length <= 0) {
    return (
      <Layout>
        <p>Nothing to export.</p>
      </Layout>
    );
  }

  if (books && books.length > 0) {
    return (
      <Layout>
        <form className="grid gap-2   p-2 mb-2">
          <h1 className="text-lg">Export to Markdown</h1>
          <select
            ref={selectRef}
            className="p-2 w-full"
            name="books"
            id="book-select"
          >
            {books.map((book, index) => (
              <option key={index} value={book.bookTitle}>
                {book.bookTitle}
              </option>
            ))}
          </select>
          <button
            className="p-2 w-full bg-neutral-300 hover:bg-neutral-700 hover:text-white"
            type="button"
            onClick={handleExport}
          >
            Export
          </button>
        </form>
      </Layout>
    );
  }
  return <Layout>ExportPage</Layout>;
}
