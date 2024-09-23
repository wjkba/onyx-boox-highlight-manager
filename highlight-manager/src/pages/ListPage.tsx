import HighlightCard from "@/components/highlights/HighlightCard";
import { db } from "@/db";
import { Layout } from "@/Layout";
import { Highlight, List } from "@/types/types";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { ScrollRestoration, useParams } from "react-router-dom";

export default function ListPage() {
  const { listId } = useParams();
  const list = useLiveQuery(() => db.lists.get(Number(listId)));
  const [highlights, setHighlights] = useState<null | Highlight[]>(null);

  useEffect(() => {
    if (list && list.highlightIds) {
      async function fetchHighlights(list: List) {
        const highlights = await db.highlights.bulkGet(list.highlightIds);
        if (highlights) setHighlights(highlights as Highlight[]);
      }
      fetchHighlights(list);
    }
  }, [list]);

  if (list && list.highlightIds.length <= 0) {
    return (
      <Layout>
        <p>Highlights added to this list will appear here</p>
      </Layout>
    );
  }

  if (list && highlights) {
    return (
      <Layout>
        {list && <h1 className="text-xl mb-2">{list.name}</h1>}

        <div className="grid gap-2">
          {highlights.map((highlight) => (
            <HighlightCard
              key={highlight.id}
              text={highlight.quote}
              bookId={highlight.bookId}
              starred={highlight.starred}
              id={highlight.id}
              options={["showRemove"]}
            />
          ))}
        </div>
        <ScrollRestoration />
      </Layout>
    );
  }

  return (
    <Layout>
      {!list && <p>List not found.</p>}
      <ScrollRestoration />
    </Layout>
  );
}
