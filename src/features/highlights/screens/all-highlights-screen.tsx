import { useAllHighlights } from "../hooks";
import HighlightsList from "../components/highlights-list";
import SearchBar from "../components/search-bar";
import SortOptions from "../components/sort-options";
import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { ScrollRestoration } from "react-router-dom";
import { type Highlight } from "@/lib/db/types";

export default function AllHighlightsPage({ UploadBooxComponent }: { UploadBooxComponent: ElementType }) {
  const [sortOption, setSortOption] = useState("dateHighlighted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const allHighlights = useAllHighlights(sortOption, sortOrder);

  const [displayedHighlights, setDisplayedHighlights] = useState<
    null | Highlight[]
  >(null);
  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    // SEARCH, LIMIT
    if (allHighlights) {
      let filteredHighlights = allHighlights;
      if (searchValue.trim() !== "") {
        filteredHighlights = allHighlights.filter((highlight) =>
          highlight.quote.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      const limitedHighlights = filteredHighlights.slice(0, limit);
      setDisplayedHighlights(limitedHighlights);
    }
  }, [allHighlights, searchValue, limit]);

  function handleLoadMore() {
    setLimit((prevLimit) => prevLimit + 20);
  }

  if (allHighlights && allHighlights.length <= 0) {
    return (

        <div className="lg:max-w-[450px]">
          <UploadBooxComponent />
        </div>

    );
  }

  if (displayedHighlights) {
    return (
      <>

          <div className="lg:max-w-[892px]">
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
          </div>

        <ScrollRestoration />
      </>
    );
  }
}
