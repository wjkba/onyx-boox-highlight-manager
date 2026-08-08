import { DailyReviewScreen } from "@/features/daily-review";
import { DailyReviewButtons } from "@/features/daily-review";
import { DailyReviewCard } from "@/features/daily-review";

export default function DailyReviewRoute() {
  return (
    <DailyReviewScreen
      DailyReviewButtonsComponent={DailyReviewButtons}
      HighlightCardComponent={DailyReviewCard}
    />
  );
}
