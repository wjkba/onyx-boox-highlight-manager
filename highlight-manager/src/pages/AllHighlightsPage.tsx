import { useLiveQuery } from "dexie-react-hooks";
import HighlightsList from "../components/highlights/HighlightsList";
import SearchBar from "../components/SearchBar";
import { Layout } from "../Layout";
import { db } from "../db";
import { type Highlight } from "../types/types";
import TestFormatter from "../components/import/TestFormatter";
import { useEffect, useMemo, useState } from "react";
import { ScrollRestoration } from "react-router-dom";

export default function AllHighlightsPage() {
  const highlights = useLiveQuery(() => db.highlights.toArray());
  const [searchValue, setSearchValue] = useState("");
  const sortedHighlights = useMemo(getSortedHighlights, [highlights]);
  function getSortedHighlights() {
    return highlights;
    // TODO: reimplement sort
    // if (books) {
    //   return books.map((highlight) => ({
    //     ...highlight,
    //     quotes: highlight.quotes.sort(
    //       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    //     ),
    //   }));
    // }
  }

  useEffect(() => {
    // if (sortedHighlights !== undefined) {
    //   setHighlights(sortedHighlights);
    // }
    console.log(highlights);
  }, [highlights]);

  useEffect(() => {
    // TODO: reimplement search
    // if (searchValue.trim() !== "") {
    //   let searchedHighlights = highlights.map((book) => {
    //     const searchedQuotes = book.quotes.filter((quote) =>
    //       quote.text.toLowerCase().includes(searchValue.toLowerCase())
    //     );
    //     return {
    //       bookAuthor: book.bookAuthor,
    //       bookTitle: book.bookTitle,
    //       quotes: searchedQuotes,
    //       id: book.id,
    //     };
    //   });
    //   setHighlights(searchedHighlights);
    // } else {
    //   const sortedHighlights = getSortedHighlights();
    //   if (sortedHighlights !== undefined) {
    //     setHighlights(sortedHighlights);
    //   }
    // }
    console.log(searchValue);
  }, [searchValue]);

  if (highlights != undefined) {
    if (highlights.length <= 0) {
      return (
        <Layout>
          <div className="lg:max-w-[450px]">
            <TestFormatter />
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
