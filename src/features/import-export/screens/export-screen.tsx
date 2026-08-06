import { useExportBooks } from "../hooks";
import { getBookHighlightsForExport, getExportBook } from "../api";
import { useRef } from "react";
import { saveAs } from "file-saver";
import { exportDbToString } from "@/lib/storage/export-db";
import Button from "@/components/ui/button";

export default function ExportPage() {
  const books = useExportBooks();
  const selectRef = useRef<HTMLSelectElement>(null);

  async function handleExport() {
    if (selectRef.current) {
      const selectedBookTitle = selectRef.current?.value;
      const book = await getExportBook(selectedBookTitle);
      if (book) {
        const highlights = await getBookHighlightsForExport(selectedBookTitle);
        const formattedHighlights = highlights?.map(
          (highlight) => `- ${highlight.quote}\n`
        );
        if (formattedHighlights) {
          const markdownContent = [
            "# Book info",
            `Author: ${book.bookAuthor}\n`,
            `Title: ${book.bookTitle}\n`,
            "",
            "# Highlights",
            ...formattedHighlights,
          ].join("\n");
          const blob = new Blob([markdownContent], {
            type: "text/markdown;charset=utf-8",
          });
          saveAs(blob, `${selectedBookTitle} - Highlights.md`);
        }
      }
    }
  }

  async function handleExportDatabase() {
    const jsonDbString = (await exportDbToString()) as string;

    const blob = new Blob([jsonDbString], { type: "text/plain" });
    saveAs(blob, "MyHighlightsDB.txt");
  }

  if (books && books.length <= 0) {
    return (
      <>
        <p>Nothing to export.</p>
      </>
    );
  }

  if (books && books.length > 0) {
    return (
      <>
        <form className="grid gap-2 lg:max-w-[450px] mb-8">
          <h1 className="text-xl">Export to Markdown</h1>

          <select
            ref={selectRef}
            className="p-2 w-full dark:bg-neutral-900"
            name="books"
            id="book-select"
          >
            {books.map((book) => (
              <option key={book.id} value={book.bookTitle}>
                {book.bookTitle}
              </option>
            ))}
          </select>

          <Button
            text="Export"
            type="button"
            onClick={handleExport}
            className="p-2 w-full"
          />
        </form>
        <form className="grid gap-2 lg:max-w-[450px] mb-8">
          <h1 className="text-xl">Export highlights database</h1>
          <p className="mb-2">
            Your highlights data is stored locally in IndexedDB database. You
            can export your highlights at any time by clicking the button below.
          </p>
          <Button
            text="Export"
            type="button"
            onClick={handleExportDatabase}
            className="p-2 w-full"
          />
        </form>
      </>
    );
  }
  return <>ExportPage</>;
}
