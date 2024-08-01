import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { Layout } from "../Layout";
import { useState } from "react";
import BookCard from "@/components/BookCard";

export default function BooksPage() {
  //const highlights = useHighlightsStore((store) => store.highlights);
  const [activeOption, setActiveOption] = useState<number | null>(null);

  const highlights = useLiveQuery(() => db.highlights.toArray());

  function showBooks() {
    if (highlights) {
      return (
        <>
          {highlights.map((element) => (
            <BookCard
              activeOption={activeOption}
              setActiveOption={setActiveOption}
              key={element.id}
              bookId={element.id}
              bookTitle={element.bookTitle}
              bookAuthor={element.bookAuthor}
            />
          ))}
        </>
      );
    }
  }
  if (highlights && highlights.length <= 0) {
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
