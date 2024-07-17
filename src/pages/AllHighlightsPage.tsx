import HighlightsList from "../components/highlights/HighlightsList";
import SearchBar from "../components/SearchBar";

export default function AllHighlightsPage() {
  return (
    <div>
      AllHighlightsPage
      <div className="mb-2">
        <SearchBar />
      </div>
      <HighlightsList />
    </div>
  );
}
