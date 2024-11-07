import { ScrollRestoration, useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import HighlightsList from "../components/highlights/HighlightsList";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Highlight } from "@/types/types";

export default function BookPage() {
  const { bookId } = useParams();
  const book = useLiveQuery(() => db.books.get(Number(bookId)));
  const highlights = useLiveQuery(() =>
    db.highlights.where("bookId").equals(Number(bookId)).toArray()
  );

  const [displayedHighlights, setDisplayedHighlights] = useState<
    null | Highlight[]
  >(null);

  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    if (highlights) {
      const highlightsToDisplay = highlights.slice(0, limit);
      setDisplayedHighlights(highlightsToDisplay);
    }
  }, [highlights]);

  useEffect(() => {
    // SEARCH, LIMIT
    if (highlights) {
      let filteredHighlights = highlights;
      if (searchValue.trim() !== "") {
        filteredHighlights = highlights.filter((highlight) =>
          highlight.quote.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      const limitedHighlights = filteredHighlights.slice(0, limit);
      setDisplayedHighlights(limitedHighlights);
    }
  }, [highlights, searchValue, limit]);

  function handleLoadMore() {
    setLimit((prevLimit) => prevLimit + 20);
  }

  if (book && displayedHighlights) {
    return (
      <Layout>
        <h1 className="text-xl mb-2">{book.bookTitle}</h1>
        <div className="mb-4">
          <SearchBar setSearchValue={setSearchValue} />
        </div>
        <HighlightsList highlights={displayedHighlights} />
        <div className="flex justify-center mb-12">
          <button
            onClick={handleLoadMore}
            className={`${
              limit > displayedHighlights.length ? "hidden " : " "
            }} mt-6 lg:max-w-[60%] w-full p-3 border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black`}
          >
            Load more
          </button>
        </div>
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
