import { ScrollRestoration, useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import HighlightsList from "../components/highlights/HighlightsList";

export default function BookPage() {
  const { bookId } = useParams();
  const book = useLiveQuery(() => db.books.get(Number(bookId)));
  const highlights = useLiveQuery(() =>
    db.highlights.where("bookId").equals(Number(bookId)).toArray()
  );

  if (book && highlights) {
    return (
      <Layout>
        <h1 className="text-xl mb-2">{book.bookTitle}</h1>
        <HighlightsList highlights={highlights} />
        <ScrollRestoration />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-xl mb-2">Book not found</h1>
      <ScrollRestoration />
    </Layout>
  );
}
