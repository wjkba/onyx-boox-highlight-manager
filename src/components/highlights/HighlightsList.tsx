import HighlightCard from "./HighlightCard";
import { type Book, type Highlight } from "@/types/types";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";

interface HighlightListProps {
  highlights: Highlight[];
}

export default function HighlightsList({
  highlights = [],
}: HighlightListProps) {
  const books = useLiveQuery(() => db.books.toArray());
  const booksById: Record<number, Book> = {};
  books?.forEach((book) => {
    booksById[book.id] = book;
  });

  return (
    <div className="grid gap-2">
      {highlights.map((highlight) => (
        <HighlightCard
          key={highlight.id}
          text={highlight.quote}
          bookId={highlight.bookId}
          book={booksById[highlight.bookId]}
          starred={highlight.starred}
          id={highlight.id!}
        />
      ))}
    </div>
  );
}
