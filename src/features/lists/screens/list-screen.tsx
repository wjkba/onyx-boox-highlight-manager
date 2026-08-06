import { useList, useListBooks } from "../hooks";
import { getListHighlights } from "../api";
import type { ElementType } from "react";
import { Book, Highlight, List } from "@/lib/db/types";
import { useEffect, useState } from "react";
import { ScrollRestoration, useParams } from "react-router-dom";

async function fetchHighlights(list: List) {
  return getListHighlights(list.highlightIds) as Promise<Highlight[]>;
}

export default function ListPage({ HighlightCardComponent }: { HighlightCardComponent: ElementType }) {
  const { listId } = useParams();
  const list = useList(Number(listId));
  const books = useListBooks();
  const booksById: Record<number, Book> = {};
  books?.forEach((book) => {
    booksById[book.id] = book;
  });
  const [highlights, setHighlights] = useState<null | Highlight[]>(null);

  useEffect(() => {
    if (list && list.highlightIds) {
      fetchHighlights(list).then(setHighlights);
    }
  }, [list]);

  if (list && list.highlightIds.length <= 0) {
    return (
      <>
        <p>Highlights added to this list will appear here</p>
      </>
    );
  }

  if (list && highlights) {
    return (
      <>
        {list && <h1 className="text-xl mb-2">{list.name}</h1>}

        <div className="grid gap-2">
          {highlights.map((highlight) => (
            <HighlightCardComponent
              key={highlight.id}
              text={highlight.quote}
              bookId={highlight.bookId}
              starred={highlight.starred}
              id={highlight.id}
              book={booksById[highlight.bookId]}
              options={["showRemove"]}
            />
          ))}
        </div>
        <ScrollRestoration />
      </>
    );
  }

  return (
    <>
      {!list && <p>List not found.</p>}
      <ScrollRestoration />
    </>
  );
}
