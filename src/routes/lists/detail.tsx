import { ListScreen } from "@/features/lists";
import { HighlightCard } from "@/features/highlights";

export default function ListRoute() {
  return <ListScreen HighlightCardComponent={HighlightCard} />;
}
