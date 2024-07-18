import HighlightsList from "../components/highlights/HighlightsList";
import SearchBar from "../components/SearchBar";
import { Layout } from "../Layout";

export default function AllHighlightsPage() {
  return (
    <Layout>
      <div>
        <div className="mb-2">
          <SearchBar />
        </div>
        <HighlightsList />
      </div>
    </Layout>
  );
}
