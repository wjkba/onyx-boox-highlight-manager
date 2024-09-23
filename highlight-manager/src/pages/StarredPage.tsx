import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import HighlightCard from "../components/highlights/HighlightCard";
import { Layout } from "../Layout";

export default function StarredPage() {
  const highlights = useLiveQuery(() => db.highlights.toArray());

  if (highlights) {
    const starredHighlights = highlights.filter(
      (highlight) => highlight.starred === true
    );
    console.log(starredHighlights);
    // const sortedHighlights = highlights.map((highlight) => ({
    //   ...highlight,
    //   quotes: highlight.quotes.sort(
    //     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    //   ),
    // }));

    // const starredHighlights = sortedHighlights
    //   .filter((highlight) => highlight.quotes.some((quote) => quote.starred))
    //   .map((highlight) => ({
    //     ...highlight,
    //     quotes: highlight.quotes.filter((quote) => quote.starred),
    //   }));

    if (starredHighlights.length <= 0) {
      return (
        <Layout>
          <p>Starred highlights will appear here.</p>
        </Layout>
      );
    }

    return (
      <Layout>
        <h1 className="text-xl mb-2">Starred</h1>
        <div className="grid gap-2">
          {starredHighlights.map((highlight) => (
            <HighlightCard
              key={highlight.id}
              text={highlight.quote}
              starred={highlight.starred}
              id={highlight.id}
              bookId={highlight.bookId}
            />
          ))}
        </div>
      </Layout>
    );
  }
}
