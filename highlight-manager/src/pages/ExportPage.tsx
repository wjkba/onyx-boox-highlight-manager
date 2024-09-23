import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { Layout } from "../Layout";
import { useRef } from "react";
import { saveAs } from "file-saver";
import { exportDbToString } from "@/utils/exportDb";

export default function ExportPage() {
  const books = useLiveQuery(() => db.books.toArray());
  const selectRef = useRef<HTMLSelectElement>(null);

  async function handleExport() {
    if (selectRef.current) {
      const selectedBookTitle = selectRef.current?.value;
      const book = await db.books.get({ bookTitle: selectedBookTitle });
      if (book) {
        const highlights = await db.highlights
          .where("bookId")
          .equals(book.id)
          .toArray();
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
    console.log(jsonDbString);
    const blob = new Blob([jsonDbString], { type: "text/plain" });
    saveAs(blob, "MyHighlightsDB.txt");
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
        <form className="grid gap-2 lg:max-w-[450px]  p-2 mb-2">
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
          <button
            className="p-2 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            type="button"
            onClick={handleExport}
          >
            Export
          </button>
        </form>
        <form className="grid gap-2 lg:max-w-[450px]  p-2 mb-2">
          <h1 className="text-xl">Export highlights database</h1>
          <p className="mb-2">
            Your highlights data is stored locally in IndexedDB database. You
            can export your highlights at any time by clicking the button below.
          </p>
          <button
            className="p-2 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            type="button"
            onClick={handleExportDatabase}
          >
            Export
          </button>
        </form>
      </Layout>
    );
  }
  return <Layout>ExportPage</Layout>;
}
