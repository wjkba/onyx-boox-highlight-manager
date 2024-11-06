import { useLiveQuery } from "dexie-react-hooks";
import HighlightsList from "../components/highlights/HighlightsList";
import SearchBar from "../components/SearchBar";
import { Layout } from "../Layout";
import { db } from "../db";
import UploadBoox from "../components/import/UploadBoox";
import { useEffect, useState } from "react";
import { ScrollRestoration } from "react-router-dom";
import { type Highlight } from "@/types/types";
import SortOptions from "@/components/highlights/SortOptions";

export default function AllHighlightsPage() {
  const [sortOption, setSortOption] = useState("dateHighlighted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const allHighlights = useLiveQuery<Highlight[]>(() => {
    if (sortOption === "dateAdded")
      return sortOrder === "desc"
        ? db.highlights.orderBy("dateAdded").reverse().toArray()
        : db.highlights.orderBy("dateAdded").toArray();
    if (sortOption === "alphabet")
      return sortOrder === "desc"
        ? db.highlights.orderBy("quote").reverse().toArray()
        : db.highlights.orderBy("quote").toArray();
    else
      return sortOrder === "desc"
        ? db.highlights.orderBy("date").reverse().toArray()
        : db.highlights.orderBy("date").toArray();
  }, [sortOption, sortOrder]);

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
      <Layout>
        <div className="lg:max-w-[450px]">
          <UploadBoox />
        </div>
      </Layout>
    );
  }

  if (displayedHighlights) {
    return (
      <>
        <Layout>
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
        </Layout>
        <ScrollRestoration />
      </>
    );
  }
}
