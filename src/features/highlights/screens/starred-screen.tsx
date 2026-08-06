import { useStarredHighlights, useHighlightBooks } from "../hooks";
import HighlightCard from "../components/highlight-card";

export default function StarredPage() {
  const starredHighlights = useStarredHighlights();
  const books = useHighlightBooks(starredHighlights ?? []);


  if (starredHighlights) {
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

          <p>Starred highlights will appear here.</p>

      );
    }

    return (
      <>
        <h1 className="text-xl mb-2">Starred</h1>
        <div className="grid gap-2">
          {starredHighlights.map((highlight) => (
            <HighlightCard
              key={highlight.id}
              text={highlight.quote}
              starred={highlight.starred}
              id={highlight.id}
              bookId={highlight.bookId}
              book={books?.[highlight.bookId]}
            />
          ))}
        </div>
      </>
    );
  }
}
