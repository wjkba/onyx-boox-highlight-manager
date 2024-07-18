import { useLiveQuery } from "dexie-react-hooks";
import HighlightsList from "../components/highlights/HighlightsList";
import SearchBar from "../components/SearchBar";
import { Layout } from "../Layout";
import { db } from "../db";
import { HighlightType } from "../utils/formatBoox";
import TestFormatter from "../components/TestFormatter";

export default function AllHighlightsPage() {
  const highlights = useLiveQuery(() => db.highlights.toArray());
  let sortedHighlights: HighlightType[];

  if (highlights != undefined) {
    if (highlights.length <= 0) {
      return (
        <Layout>
          <TestFormatter />
        </Layout>
      );
    }

    sortedHighlights = highlights.map((highlight) => ({
      ...highlight,
      quotes: highlight.quotes.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));
    return (
      <Layout>
        <div>
          <div className="mb-2">
            <SearchBar />
          </div>
          <HighlightsList highlights={highlights} />
        </div>
      </Layout>
    );
  }
}
