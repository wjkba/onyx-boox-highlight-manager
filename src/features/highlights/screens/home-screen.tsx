import { useRecentHighlights } from "../hooks";
import { BiSolidFlame } from "react-icons/bi";
import Button from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { ScrollRestoration } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Home({
  ImportDatabaseComponent,
  UploadBooxComponent,
  getCurrentStreak,
  isDailyReviewCompleted,
}: {
  ImportDatabaseComponent: ElementType;
  UploadBooxComponent: ElementType;
  getCurrentStreak: () => number;
  isDailyReviewCompleted: () => boolean;
}) {
  const navigate = useNavigate();
  const highlights = useRecentHighlights();
  const [isReviewCompleted, setIsReviewCompleted] = useState(true);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    const isCompleted = isDailyReviewCompleted();
    const currentStreak = getCurrentStreak();
    setIsReviewCompleted(isCompleted);
    setStreakCount(currentStreak);
  }, [getCurrentStreak, isDailyReviewCompleted]);

  function DailyReview() {
    if (!isReviewCompleted) {
      return (
        <div className="lg:max-w-[17rem]">
          <h1 className="text-xl font-medium">Daily review</h1>
          <div className="flex items-center justify-between mb-4">
            <p>Daily review is available</p>
            {streakCount > 0 && (
              <div className="flex  items-center gap-1">
                <BiSolidFlame size={16} />
                <p className="text-sm">
                  {streakCount} {streakCount === 1 ? "day" : "days"}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            className="w-full p-2"
            text="Open Daily Review"
            onClick={() => navigate("/review")}
          />
        </div>
      );
    } else return;
  }

  if (highlights && highlights.length > 0)
    return (
      <>

          <section id="newest-highlights" className="mb-8">
            {highlights && highlights.length > 0 && (
              <div>
                <h1 className="text-xl font-medium mb-2">Newest Highlights</h1>
                <div className="grid xs:grid-cols-3 gap-2">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      onClick={() => navigate(`/highlight/${highlight.id}`)}
                      className="max-h-[10rem] lg:max-h-[12rem] text-xs lg:text-base w-full overflow-hidden dark:border-stone-500 border-stone-400 border-solid border p-2 hover-trigger"
                    >
                      {highlight.quote}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section id="daily-review" className="mb-8">
            <DailyReview />
          </section>

          <section className="mb-8" id="all-highlights">
            <h1 className="text-xl font-medium mb-2">All Highlights</h1>
            <Button
              variant="secondary"
              className="w-full lg:max-w-[276px] p-2"
              text="View All Highlights"
              onClick={() => navigate("/all")}
            />
          </section>

          <section id="add-highlight">
            <h1 className="text-xl mb-2 font-medium">Add New Highlight</h1>
            <Button
              variant="secondary"
              className="w-full lg:max-w-[276px] p-2"
              text="Add New Highlight"
              onClick={() => navigate("/add")}
            />
          </section>

        <ScrollRestoration />
      </>
    );

  return (

      <div className="lg:max-w-[450px]">
        <h1 className="mb-6 text-2xl font-medium">
          Import your highlights to get started
        </h1>
        <div className="mb-8">
          <UploadBooxComponent />
        </div>
        <ImportDatabaseComponent />
      </div>

  );
}
