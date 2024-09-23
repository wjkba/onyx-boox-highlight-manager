import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { Layout } from "../Layout";
import { useState } from "react";
import BookCard from "@/components/BookCard";

export default function BooksPage() {
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const books = useLiveQuery(() => db.books.toArray());

  function showBooks() {
    if (books) {
      return (
        <>
          {books.map((book) => (
            <BookCard
              activeOption={activeOption}
              setActiveOption={setActiveOption}
              key={book.id}
              bookId={book.id}
              bookTitle={book.bookTitle}
              bookAuthor={book.bookAuthor}
            />
          ))}
        </>
      );
    }
  }
  if (books && books.length <= 0) {
    return (
      <Layout>
        <p>No highlights found.</p>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="grid gap-2 lg:flex lg:gap-[16px] lg:flex-wrap">
        {showBooks()}
      </div>
    </Layout>
  );
}
