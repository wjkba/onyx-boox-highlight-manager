import { useExportBooks } from "../hooks";
import { getBookHighlightsForExport, getExportBook } from "../api";
import { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { exportDbToString } from "@/lib/storage/export-db";
import Button from "@/components/ui/button";

export default function ExportPage() {
  const books = useExportBooks();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [busy, setBusy] = useState<"markdown" | "database" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleExport() {
    setBusy("markdown"); setMessage(null); setErrorMessage(null);
    try {
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
      setMessage("Markdown export downloaded successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Markdown export failed.");
    } finally { setBusy(null); }
  }

  async function handleExportDatabase() {
    setBusy("database"); setMessage(null); setErrorMessage(null);
    try {
      const jsonDbString = await exportDbToString();
      saveAs(new Blob([jsonDbString], { type: "application/json" }), "MyHighlightsDB.json");
      setMessage("Database export downloaded successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Database export failed.");
    } finally { setBusy(null); }
  }

  return (
      <>
        {message && <output className="block text-green-600 mb-4">{message}</output>}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {books && books.length > 0 ? <form className="grid gap-2 lg:max-w-[450px] mb-8">
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
            disabled={busy !== null}
            aria-busy={busy === "markdown"}
            className="p-2 w-full"
          />
        </form> : <p className="mb-8">Nothing to export as Markdown.</p>}
        <form className="grid gap-2 lg:max-w-[450px] mb-8">
          <h1 className="text-xl">Export highlights database</h1>
          <p className="mb-2">
            Your highlights data is stored locally in IndexedDB database. You
            can export your highlights at any time by clicking the button below.
          </p>
          <Button
            text={busy === "database" ? "Exporting…" : "Export"}
            type="button"
            onClick={handleExportDatabase}
            disabled={busy !== null}
            aria-busy={busy === "database"}
            className="p-2 w-full"
          />
        </form>
        {busy && <output className="block">Preparing {busy} export…</output>}
      </>
    );
}
