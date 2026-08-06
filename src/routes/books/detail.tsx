import { BookScreen } from "@/features/books";
import { HighlightsList, SearchBar, SortOptions } from "@/features/highlights";

export default function BookRoute() {
  return (
    <BookScreen
      HighlightsListComponent={HighlightsList}
      SearchBarComponent={SearchBar}
      SortOptionsComponent={SortOptions}
    />
  );
}
