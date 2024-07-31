import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { Layout } from "../Layout";
import { Link } from "react-router-dom";

export default function BooksPage() {
  //const highlights = useHighlightsStore((store) => store.highlights);
  const highlights = useLiveQuery(() => db.highlights.toArray());

  function showBooks() {
    if (highlights) {
      return (
        <>
          {highlights.map((element) => (
            <Link
              to={`/books/${element.id}`}
              key={element.id}
              className="p-4 border dark:border-white border-black lg:max-w-[276px] w-full dark:hover:bg-neutral-900  hover:bg-neutral-50"
            >
              <p className="text-lg">{element.bookTitle}</p>
              <p className="text-neutral-600 dark:text-neutral-400">
                {element.bookAuthor}
              </p>
            </Link>
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
