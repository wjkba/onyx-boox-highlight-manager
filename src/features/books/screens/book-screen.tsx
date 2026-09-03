import { useBook, useBookHighlights } from "../hooks";
import { ScrollRestoration, useParams } from "react-router-dom";
import type { ElementType } from "react";
import { useMemo, useState } from "react";
import { outlineInverseClasses } from "@/components/ui/button";

export default function BookPage({
  HighlightsListComponent,
  SearchBarComponent,
  SortOptionsComponent,
}: {
  HighlightsListComponent: ElementType;
  SearchBarComponent: ElementType;
  SortOptionsComponent: ElementType;
}) {
  const { bookId } = useParams();
  const book = useBook(Number(bookId));
  const [sortOption, setSortOption] = useState("dateHighlighted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(20);

  const highlights = useBookHighlights(Number(bookId));

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
      <>
        <h1 className="text-xl mb-2">{book.bookTitle}</h1>
        <div className="mb-4">
          <SearchBarComponent setSearchValue={setSearchValue} />
        </div>
        <div className="mb-2">
          <SortOptionsComponent
            sortOption={sortOption}
            setSortOption={setSortOption}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
        <HighlightsListComponent highlights={filteredHighlights} />
        <div className="flex justify-center mb-12">
          <button
            type="button"
            onClick={handleLoadMore}
            className={`${
              limit > displayedHighlights.length ? "hidden " : " "
            } mt-6 lg:max-w-[60%] w-full p-3 ${outlineInverseClasses}`}
          >
            Load more
          </button>
        </div>
        <ScrollRestoration />
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl mb-2">Book not found</h1>
      <ScrollRestoration />
    </>
  );
}
