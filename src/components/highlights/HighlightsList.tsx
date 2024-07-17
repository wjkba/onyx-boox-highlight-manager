import { useLiveQuery } from "dexie-react-hooks";
import { useHighlightsStore } from "../../store";
import HighlightCard from "./HighlightCard";
import { db } from "../../db";
import TestFormatter from "../TestFormatter";

export default function HighlightsList() {
  //const highlights = useHighlightsStore((store) => store.highlights);
  const highlights = useLiveQuery(() => db.highlights.toArray());

  if (highlights) {
    if (highlights?.length <= 0) {
      return <TestFormatter />;
    }
    return (
      <div className="grid gap-2">
        {highlights.map((highlight) =>
          highlight.quotes.map((quote, index) => (
            <HighlightCard
              key={`${index}${highlight.bookTitle}`}
              quote={quote.text}
              bookAuthor={highlight.bookAuthor}
              bookTitle={highlight.bookTitle}
            />
          ))
        )}
      </div>
    );
  }
}
