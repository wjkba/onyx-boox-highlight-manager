import HighlightCard from "./HighlightCard";
import { HighlightType } from "../../utils/formatBoox";

interface HighlightListProps {
  highlights: HighlightType[];
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
          />
        ))
      )}
    </div>
  );
}
