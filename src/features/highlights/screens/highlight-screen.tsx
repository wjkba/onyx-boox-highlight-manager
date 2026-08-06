import { useHighlight, useHighlightBook } from "../hooks";
import HighlightCard from "../components/highlight-card";
import { useParams } from "react-router-dom";

export default function HighlightPage() {
  const { highlightId } = useParams();
  const highlight = useHighlight(Number(highlightId));
  const book = useHighlightBook(highlight?.bookId);

  if (highlight) {
    return (
      <>
        <HighlightCard
          key={highlight.id}
          id={highlight.id}
          starred={highlight.starred}
          text={highlight.quote}
          bookId={highlight?.bookId}
          book={book}
        />
      </>
    );
  }
  return <>no highlight found</>;
}
