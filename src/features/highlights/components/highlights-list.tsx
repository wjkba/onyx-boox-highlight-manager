import { useHighlightBooks } from "../hooks";
import HighlightCard from "./highlight-card";
import { type Highlight } from "@/lib/db/types";

interface HighlightListProps {
  highlights: Highlight[];
}

export default function HighlightsList({
  highlights = [],
}: HighlightListProps) {
  const books = useHighlightBooks(highlights);
  return (
    <div className="grid gap-2">
      {highlights.map((highlight) => (
        <HighlightCard
          key={highlight.id}
          text={highlight.quote}
          bookId={highlight.bookId}
          book={books?.[highlight.bookId]}
          starred={highlight.starred}
          id={highlight.id!}
        />
      ))}
    </div>
  );
}
