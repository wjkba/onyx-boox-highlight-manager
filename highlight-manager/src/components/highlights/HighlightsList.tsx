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
      {highlights.map((highlight, index) => (
        <HighlightCard
          key={`${index}${highlight.bookTitle}`}
          text={highlight.quote}
          bookAuthor={highlight.bookAuthor}
          bookTitle={highlight.bookTitle}
          starred={highlight.starred}
          id={highlight.id!}
        />
      ))}
    </div>
  );
}
