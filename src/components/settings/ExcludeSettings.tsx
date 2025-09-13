import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";

export default function ExcludeSettings() {
  const books = useLiveQuery(() => db.books.toArray());
  const dropdownRef = useRef<HTMLSelectElement>(null);
  const [excludedBookIds, setExcludedBookIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const localExcludedBooks = localStorage.getItem("excludedBooks");
      if (localExcludedBooks) {
        const parsedIds = JSON.parse(localExcludedBooks);
        setExcludedBookIds(Array.isArray(parsedIds) ? parsedIds : []);
      }
    } catch (error) {
      console.error("Error loading excluded books:", error);
    }
  }, []);

  const saveExcludedBooks = (bookIds: number[]) => {
    try {
      localStorage.setItem("excludedBooks", JSON.stringify(bookIds));
    } catch (error) {
      console.error("Error saving excluded books:", error);
    }
  };

  function handleExcludeBook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const selectedBookId = dropdownRef.current?.value;

    if (!selectedBookId || selectedBookId === "") {
      return;
    }

    const bookId = Number(selectedBookId);

    if (excludedBookIds.includes(bookId)) {
      return;
    }

    const newExcludedBooks = [...excludedBookIds, bookId];
    setExcludedBookIds(newExcludedBooks);
    saveExcludedBooks(newExcludedBooks);

    if (dropdownRef.current) {
      dropdownRef.current.value = "";
    }
  }

  function ExcludedBookCard({
    bookTitle,
    bookId,
  }: {
    bookTitle: string;
    bookId: number;
  }) {
    function handleIncludeBook(e: React.MouseEvent) {
      e.preventDefault();
      const newExcludedBooks = excludedBookIds.filter((id) => id !== bookId);
      setExcludedBookIds(newExcludedBooks);
      saveExcludedBooks(newExcludedBooks);
    }

    return (
      <button
        type="button"
        className="flex text-sm gap-2 px-2 py-1 bg-neutral-200 dark:bg-neutral-900 hover:bg-neutral-300 dark:hover:bg-neutral-700 dark:text-white"
        onClick={handleIncludeBook}
        aria-label={`Remove ${bookTitle} from excluded books`}
      >
        <p>{bookTitle}</p>
        <span className="text-red-500">✕</span>
      </button>
    );
  }

  const excludedBooksWithTitles = excludedBookIds
    .map((id) => {
      const book = books?.find((b) => b.id === id);
      return book ? { id, title: book.bookTitle } : null;
    })
    .filter(Boolean);

  return (
    <div className="w-full max-w-full">
      <form onSubmit={handleExcludeBook} className="w-full">
        <div className="flex mb-2 flex-wrap gap-2">
          {excludedBooksWithTitles.map(
            (book) =>
              book && (
                <ExcludedBookCard
                  bookTitle={book.title}
                  bookId={book.id}
                  key={book.id}
                />
              )
          )}
          {excludedBooksWithTitles.length === 0 && (
            <p className="text-gray-500 text-sm">
              No books are currently excluded
            </p>
          )}
        </div>

        <div className="lg:flex-row flex flex-col gap-2 w-full">
          <select
            className="w-full flex-shrink min-w-0 max-w-full p-2 dark:bg-black text-ellipsis"
            defaultValue=""
            ref={dropdownRef}
          >
            <option disabled value="">
              Select a book
            </option>
            {books?.map((book) => (
              <option
                value={book.id}
                key={book.id}
                disabled={excludedBookIds.includes(book.id)}
              >
                {book.bookTitle}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            text="Exclude"
            className="p-2 w-full lg:w-auto lg:whitespace-nowrap"
            disabled={!books || books.length === 0}
          />
        </div>
      </form>
    </div>
  );
}
