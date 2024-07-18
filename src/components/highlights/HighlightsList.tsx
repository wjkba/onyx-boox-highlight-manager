import { useLiveQuery } from "dexie-react-hooks";
import HighlightCard from "./HighlightCard";
import { db } from "../../db";
import TestFormatter from "../TestFormatter";

export default function HighlightsList() {
  //const highlights = useHighlightsStore((store) => store.highlights);
  const highlights = useLiveQuery(() => db.highlights.toArray());
  console.log(highlights);

  if (highlights) {
    if (highlights?.length <= 0) {
      return <TestFormatter />;
    }

    const sortedHighlights = highlights.map((highlight) => ({
      ...highlight,
      quotes: highlight.quotes.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));

    return (
      <div className="grid gap-2">
        {sortedHighlights.map((highlight) =>
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
}
