import { useHighlightsStore } from "../store";
import HighlightCard from "./HighlightCard";

export default function HighlightsList() {
  const highlights = useHighlightsStore((store) => store.highlights);
  return (
    <div className="grid gap-2">
      {highlights.map((highlight) =>
        highlight.quotes.map((quote, index) => (
          <HighlightCard
            key={`${index}${highlight.bookTitle}`}
            quote={quote}
            bookAuthor={highlight.bookAuthor}
            bookTitle={highlight.bookTitle}
          />
        ))
      )}
    </div>
  );
}
