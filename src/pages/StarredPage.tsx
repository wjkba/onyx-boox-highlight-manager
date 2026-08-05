import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import HighlightCard from "../components/highlights/HighlightCard";
import { Layout } from "../Layout";
import { type Book } from "@/types/types";

export default function StarredPage() {
  const starredHighlights = useLiveQuery(() =>
    db.highlights.filter((highlight) => highlight.starred === true).toArray()
  );
  const books = useLiveQuery(() => db.books.toArray());
  const booksById: Record<number, Book> = {};
  books?.forEach((book) => {
    booksById[book.id] = book;
  });

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
              book={booksById[highlight.bookId]}
            />
          ))}
        </div>
      </Layout>
    );
  }
}
