import HighlightCard from "./HighlightCard";
import { type Highlight } from "@/types/types";

interface HighlightListProps {
  highlights: Highlight[];
}

export default function HighlightsList({
  highlights = [],
}: HighlightListProps) {
  return (
    <div className="grid gap-2">
      {highlights.map((highlight) => (
        <HighlightCard
          key={highlight.id}
          text={highlight.quote}
          bookId={highlight.bookId}
          starred={highlight.starred}
          id={highlight.id!}
        />
      ))}
    </div>
  );
}
