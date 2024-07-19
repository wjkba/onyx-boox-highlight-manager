import { useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import slugify from "slugify";
import { useEffect, useState } from "react";
import { HighlightType } from "../utils/formatBoox";
import HighlightsList from "../components/highlights/HighlightsList";

export default function BookPage() {
  const [bookInfo, setBookInfo] = useState<HighlightType | null>(null);
  const { bookSlug } = useParams();
  const books = useLiveQuery(() => db.highlights.toArray());

  useEffect(() => {
    if (books) {
      const bookObject = books.find(
        (book) => slugifyToLower(book.bookTitle) === bookSlug
      );
      if (bookObject === undefined) {
        console.log("book not found");
      } else {
        setBookInfo(bookObject);
      }
    }
  }, [books]);

  function slugifyToLower(string: string) {
    return slugify(string, { lower: true });
  }

  return (
    <Layout>
      {bookInfo && <h1 className="text-xl mb-2">{bookInfo.bookTitle}</h1>}
      {bookInfo && <HighlightsList highlights={[bookInfo]} />}
      {!bookInfo && <p>Book not found.</p>}
    </Layout>
  );
}
