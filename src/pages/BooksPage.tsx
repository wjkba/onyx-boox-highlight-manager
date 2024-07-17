import { useLiveQuery } from "dexie-react-hooks";
import { useHighlightsStore } from "../store";
import { db } from "../db";

export default function BooksPage() {
  //const highlights = useHighlightsStore((store) => store.highlights);
  const highlights = useLiveQuery(() => db.highlights.toArray());

  function showBooks() {
    if (highlights) {
      return (
        <div className="grid gap-2">
          {highlights.map((element, index) => (
            <div key={index} className="p-2 border border-black">
              <p>{element.bookTitle}</p>
              <p className="text-neutral-600">{element.bookAuthor}</p>
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <>
      <h1>BooksPage</h1>
      {showBooks()}
    </>
  );
}
