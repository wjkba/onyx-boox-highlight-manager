import { useBooks } from "../hooks";
import { useState } from "react";
import BookCard from "../components/book-card";

export default function BooksPage() {
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const books = useBooks();

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

        <p>No highlights found.</p>

    );
  }
  return (

      <div className="grid gap-2 mb-16 lg:flex lg:gap-[16px] lg:flex-wrap">
        {showBooks()}
      </div>

  );
}
