import { ScrollRestoration, useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import HighlightsList from "../components/highlights/HighlightsList";
import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import SortOptions from "@/components/highlights/SortOptions";

export default function BookPage() {
  const { bookId } = useParams();
  const book = useLiveQuery(() => db.books.get(Number(bookId)));
  const [sortOption, setSortOption] = useState("dateHighlighted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(20);

  const highlights = useLiveQuery(() =>
    db.highlights.where("bookId").equals(Number(bookId)).toArray()
  );

  const sortedHighlights = useMemo(() => {
    if (!highlights) return [];

    const sorted = [...highlights];

    if (sortOption === "dateAdded") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          : new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    }
    if (sortOption === "alphabet") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? b.quote.localeCompare(a.quote)
          : a.quote.localeCompare(b.quote)
      );
    } else {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return sorted;
  }, [highlights, sortOption, sortOrder]);

  const displayedHighlights = useMemo(() => {
    return sortedHighlights.slice(0, limit);
  }, [sortedHighlights, limit]);

  const filteredHighlights = useMemo(() => {
    if (!searchValue.trim()) return displayedHighlights;
    return displayedHighlights.filter((highlight) =>
      highlight.quote.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [displayedHighlights, searchValue]);

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
        <div className="mb-2">
          <SortOptions
            sortOption={sortOption}
            setSortOption={setSortOption}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
        <HighlightsList highlights={filteredHighlights} />
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
