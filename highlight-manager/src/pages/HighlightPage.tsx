import HighlightCard from "@/components/highlights/HighlightCard";
import { db } from "@/db";
import { Layout } from "@/Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router-dom";

export default function HighlightPage() {
  const { highlightId } = useParams();
  const highlight = useLiveQuery(() => db.highlights.get(Number(highlightId)));

  if (highlight) {
    return (
      <Layout>
        <HighlightCard
          key={highlight.id}
          id={highlight.id}
          starred={highlight.starred}
          text={highlight.quote}
          bookId={highlight?.bookId}
        />
      </Layout>
    );
  }
  return <Layout>no highlight found</Layout>;
}
