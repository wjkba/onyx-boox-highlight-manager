import { useLiveQuery } from "dexie-react-hooks";
import TestFormatter from "../components/TestFormatter";
import { db } from "../db";
import HighlightCard from "../components/highlights/HighlightCard";
import { Layout } from "../Layout";

export default function StarredPage() {
  const highlights = useLiveQuery(() => db.highlights.toArray());

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

    const starredHighlights = sortedHighlights
      .filter((highlight) => highlight.quotes.some((quote) => quote.starred))
      .map((highlight) => ({
        ...highlight,
        quotes: highlight.quotes.filter((quote) => quote.starred),
      }));

    return (
      <Layout>
        <div className="grid gap-2">
          {starredHighlights.map((highlight) =>
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
      </Layout>
    );
  }
}
