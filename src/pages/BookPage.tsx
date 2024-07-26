import { ScrollRestoration, useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { useEffect, useState } from "react";
import { type BookEntry } from "../types/types";
import HighlightsList from "../components/highlights/HighlightsList";

export default function BookPage() {
  const [bookInfo, setBookInfo] = useState<BookEntry | null>(null);
  const { bookId } = useParams();
  const books = useLiveQuery(() => db.highlights.toArray());

  useEffect(() => {
    if (books) {
      const bookObject = books.find((book) => String(book.id) === bookId);
      if (bookObject === undefined) {
        console.log("book not found");
      } else {
        setBookInfo(bookObject);
      }
    }
  }, [books]);

  return (
    <Layout>
      {bookInfo && <h1 className="text-xl mb-2">{bookInfo.bookTitle}</h1>}
      {bookInfo && <HighlightsList highlights={[bookInfo]} />}
      {!bookInfo && <p>Book not found.</p>}
      <ScrollRestoration />
    </Layout>
  );
}
