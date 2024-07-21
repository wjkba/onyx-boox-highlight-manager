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
        <div className="grid gap-2">
          {highlights.map((element) => (
            <Link
              to={`/books/${element.id}`}
              key={element.id}
              className="p-4 border border-black"
            >
              <p className="text-lg">{element.bookTitle}</p>
              <p className="text-neutral-600">{element.bookAuthor}</p>
            </Link>
          ))}
        </div>
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
  return <Layout>{showBooks()}</Layout>;
}
