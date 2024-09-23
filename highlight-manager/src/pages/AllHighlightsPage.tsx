import { useLiveQuery } from "dexie-react-hooks";
import HighlightsList from "../components/highlights/HighlightsList";
import SearchBar from "../components/SearchBar";
import { Layout } from "../Layout";
import { db } from "../db";
import UploadBoox from "../components/import/UploadBoox";
import { useEffect, useState } from "react";
import { ScrollRestoration } from "react-router-dom";
import { type Highlight } from "@/types/types";

export default function AllHighlightsPage() {
  const allHighlights = useLiveQuery(() =>
    db.highlights.orderBy("date").reverse().toArray()
  );
  const [highlights, setHighlights] = useState<null | Highlight[]>(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (allHighlights) setHighlights(allHighlights);
  }, [allHighlights]);

  // TODO: implement sorting

  useEffect(() => {
    if (searchValue.trim() !== "" && allHighlights) {
      let searchedHighlights = allHighlights.filter((highlight) =>
        highlight.quote.toLowerCase().includes(searchValue.toLowerCase())
      );
      setHighlights(searchedHighlights);
    } else allHighlights ? setHighlights(allHighlights) : setHighlights(null);
  }, [searchValue]);

  if (highlights != undefined) {
    if (highlights.length <= 0) {
      return (
        <Layout>
          <div className="lg:max-w-[450px]">
            <UploadBoox />
          </div>
        </Layout>
      );
    }

    return (
      <>
        <Layout>
          <div className="lg:max-w-[892px]">
            <div className="mb-2">
              <SearchBar setSearchValue={setSearchValue} />
            </div>
            <HighlightsList highlights={highlights} />
          </div>
        </Layout>
        <ScrollRestoration />
      </>
    );
  }
}
