import { useHighlights } from "../context/highlightsContext";
import HighlightCard from "./HighlightCard";

export default function HighlightsList() {
  const { highlights } = useHighlights();
  return (
    <div className="grid gap-2">
      {highlights.map((highlight, index) => (
        <HighlightCard
          key={index}
          quote={highlight.quote}
          bookAuthor={highlight.bookAuthor}
          bookTitle={highlight.bookTitle}
        />
      ))}
    </div>
  );
}
