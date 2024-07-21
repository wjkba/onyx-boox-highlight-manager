import { useLiveQuery } from "dexie-react-hooks";
import HighlightsList from "../components/highlights/HighlightsList";
import SearchBar from "../components/SearchBar";
import { Layout } from "../Layout";
import { db } from "../db";
import { type BookEntry } from "../types";
import TestFormatter from "../components/TestFormatter";
import { useEffect, useMemo, useState } from "react";

export default function AllHighlightsPage() {
  const books = useLiveQuery(() => db.highlights.toArray());
  const [highlights, setHighlights] = useState<BookEntry[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const sortedHighlights = useMemo(getSortedHighlights, [books]);
  function getSortedHighlights() {
    if (books) {
      return books.map((highlight) => ({
        ...highlight,
        quotes: highlight.quotes.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));
    }
  }

  useEffect(() => {
    if (sortedHighlights !== undefined) {
      setHighlights(sortedHighlights);
    }
  }, [books]);

  useEffect(() => {
    if (searchValue.trim() !== "") {
      let searchedHighlights = highlights.map((book) => {
        const searchedQuotes = book.quotes.filter((quote) =>
          quote.text.toLowerCase().includes(searchValue.toLowerCase())
        );
        return {
          bookAuthor: book.bookAuthor,
          bookTitle: book.bookTitle,
          quotes: searchedQuotes,
          id: book.id,
        };
      });
      setHighlights(searchedHighlights);
    } else {
      const sortedHighlights = getSortedHighlights();
      if (sortedHighlights !== undefined) {
        setHighlights(sortedHighlights);
      }
    }
  }, [searchValue]);

  if (books != undefined) {
    if (books.length <= 0) {
      return (
        <Layout>
          <TestFormatter />
        </Layout>
      );
    }

    return (
      <Layout>
        <div>
          <div className="mb-2">
            <SearchBar setSearchValue={setSearchValue} />
          </div>
          <HighlightsList highlights={highlights} />
        </div>
      </Layout>
    );
  }
}
