import { HomeScreen } from "@/features/highlights";
import { ImportDatabase, UploadBoox } from "@/features/import-export";
import { getCurrentStreak, isDailyReviewCompleted } from "@/features/daily-review";

export default function HomeRoute() {
  return (
    <HomeScreen
      ImportDatabaseComponent={ImportDatabase}
      UploadBooxComponent={UploadBoox}
      getCurrentStreak={getCurrentStreak}
      isDailyReviewCompleted={isDailyReviewCompleted}
    />
  );
}
