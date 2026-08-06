import { DailyReviewScreen } from "@/features/daily-review";
import { DailyReviewButtons } from "@/features/daily-review";
import { HighlightCard } from "@/features/highlights";

export default function DailyReviewRoute() {
  return (
    <DailyReviewScreen
      DailyReviewButtonsComponent={DailyReviewButtons}
      HighlightCardComponent={HighlightCard}
    />
  );
}
