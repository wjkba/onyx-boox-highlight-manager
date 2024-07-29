import HighlightCard from "@/components/highlights/HighlightCard";
import { db } from "@/db";
import { Layout } from "@/Layout";
import { List } from "@/types/types";
import { useEffect, useState } from "react";
import { ScrollRestoration, useParams } from "react-router-dom";

export default function ListPage() {
  const [listInfo, setListInfo] = useState<List | null>(null);
  const { listId } = useParams();

  useEffect(() => {
    async function getList(id: number) {
      try {
        const list = await db.lists.get(id);
        if (list) {
          setListInfo(list);
        }
      } catch (error) {
        console.error("Failed to get list");
      }
    }
    getList(Number(listId));
  }, []);

  if (listInfo && listInfo.quotes.length <= 0) {
    return (
      <Layout>
        <p>Highlights added to this list will appear here</p>
      </Layout>
    );
  }

  if (listInfo) {
    return (
      <Layout>
        {listInfo && <h1 className="text-xl mb-2">{listInfo.name}</h1>}

        <div className="grid gap-2">
          {listInfo.quotes.map((quote, index) => (
            <HighlightCard
              key={`${index}${quote.bookTitle}`}
              text={quote.text}
              bookAuthor={quote.bookAuthor}
              bookTitle={quote.bookTitle}
              starred={quote.starred}
              id={quote.id!}
              bookId={quote.bookId}
              options={["showRemove"]}
            />
          ))}
        </div>
        {!listInfo && <p>List not found.</p>}
        <ScrollRestoration />
      </Layout>
    );
  }

  return (
    <Layout>
      {!listInfo && <p>List not found.</p>}
      <ScrollRestoration />
    </Layout>
  );
}
