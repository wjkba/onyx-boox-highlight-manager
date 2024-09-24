import { db } from "@/db";
import { useEffect, useState } from "react";

type DailyReviewCardProps = {
  bookId: number;
  text: string;
};

export default function DailyReviewCard({
  bookId,
  text,
}: DailyReviewCardProps) {
  const [bookTitle, setBookTitle] = useState<string>("");
  const [bookAuthor, setBookAuthor] = useState<string>("");

  useEffect(() => {
    async function fetchBookDetails() {
      const book = await db.books.get(bookId);
      if (book) {
        setBookTitle(book.bookTitle);
        setBookAuthor(book.bookAuthor);
      }
    }
    fetchBookDetails();
  }, []);

  return (
    <div className="max-w-[600px] border dark:border-white border-black">
      <div className="dark:bg-neutral-100 dark:text-black bg-neutral-900 w-full text-white min-h-[56px] flex items-center p-4">
        <p>
          {bookTitle} - {bookAuthor}
        </p>
      </div>
      <p className="p-4 font-robotoSlab">{text}</p>
    </div>
  );
}
