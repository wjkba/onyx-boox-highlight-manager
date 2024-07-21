import HighlightCard from "./HighlightCard";
import { type BookEntry } from "@/types";

interface HighlightListProps {
  highlights: BookEntry[];
}

export default function HighlightsList({
  highlights = [],
}: HighlightListProps) {
  return (
    <div className="grid gap-2">
      {highlights.map((highlight) =>
        highlight.quotes.map((quote, index) => (
          <HighlightCard
            key={`${index}${highlight.bookTitle}`}
            text={quote.text}
            bookAuthor={highlight.bookAuthor}
            bookTitle={highlight.bookTitle}
            starred={quote.starred}
            id={quote.id!}
            bookId={highlight.id}
          />
        ))
      )}
    </div>
  );
}
