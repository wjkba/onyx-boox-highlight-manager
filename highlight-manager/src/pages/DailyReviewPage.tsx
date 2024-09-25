import DailyReviewCard from "@/components/review/DailyReviewCard";
import Navbar from "@/components/Navbar";
import { db, deleteHighlights } from "@/db";
import { getDailyReviewQuotes } from "@/utils/dailyReview";
import { useEffect, useState } from "react";
import DailyReviewButtons from "@/components/review/DailyReviewButtons";
import { Highlight } from "@/types/types";

export default function DailyReviewPage() {
  const [dailyHighlights, setDailyHighlights] = useState<Highlight[] | null>(
    null
  );
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewIsCompleted, setReviewIsCompleted] = useState<boolean>(false);
  const [toDeleteIds, setToDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    const lastReview = localStorage.getItem("lastDailyReview");
    if (lastReview) {
      const lastReviewDate = new Date(Date.parse(lastReview));
      const now = new Date();
      if (
        lastReviewDate.getFullYear() === now.getFullYear() &&
        lastReviewDate.getMonth() === now.getMonth() &&
        lastReviewDate.getDate() === now.getDate()
      ) {
        setReviewIsCompleted(true);
      }
    }
    async function fetchDaily() {
      try {
        const daily = await getDailyReviewQuotes();
        if (daily) {
          console.log("🚀 ~ fetchDaily ~ daily:", daily);
          setDailyHighlights(daily);
          setActiveHighlight(daily[0]);
        }
      } catch (error) {
        console.error("Failed to fetch daily highlights:", error);
      }
    }
    fetchDaily();
  }, []);

  function handleNext() {
    if (dailyHighlights) {
      const nextIndex = currentIndex + 1;
      if (nextIndex > dailyHighlights.length - 1) {
        const now = new Date();
        localStorage.setItem("lastDailyReview", now.toISOString());
        setReviewIsCompleted(true);
        updateReviewedQuotes();
      } else {
        setActiveHighlight(dailyHighlights[nextIndex]);
        setCurrentIndex(nextIndex);
      }
    }
  }

  function handleBack() {
    if (dailyHighlights) {
      const nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        return;
      } else {
        setActiveHighlight(dailyHighlights[nextIndex]);
        setCurrentIndex(nextIndex);
      }
      console.log(dailyHighlights[nextIndex]);
    }
  }
  async function handleAddToStarred() {
    if (activeHighlight) {
      await db.highlights
        .where("id")
        .equals(activeHighlight.id)
        .modify({ starred: !activeHighlight.starred });
      const updatedDailyHighlights = dailyHighlights?.map((highlight) => {
        if (highlight.id === activeHighlight.id)
          return { ...highlight, starred: !highlight.starred };
        else return highlight;
      });
      if (updatedDailyHighlights) setDailyHighlights(updatedDailyHighlights);
    }
  }
  function handleMarkForDelete() {
    if (activeHighlight) {
      const activeHighlightId = activeHighlight.id;
      if (!toDeleteIds.includes(activeHighlightId)) {
        setToDeleteIds((s) => [...s, activeHighlightId]);
        return;
      }
      setToDeleteIds((s) => s.filter((id) => id !== activeHighlightId));
    }
  }

  async function updateReviewedQuotes() {
    try {
      const newReviewedDate = new Date().toISOString();
      const reviewedHighlights = dailyHighlights?.map((highlight) => {
        return { ...highlight, lastReviewed: newReviewedDate };
      });
      if (reviewedHighlights) {
        for (let highlight of reviewedHighlights) {
          await db.highlights.update(highlight.id, highlight);
        }
      } else throw new Error();
      await deleteMarkedHighlights(toDeleteIds);
    } catch (error) {
      console.log("error updating reviewed quotes");
      console.log(error);
    }
  }

  async function deleteMarkedHighlights(toDeleteIds: number[]) {
    try {
      await deleteHighlights(toDeleteIds);
      console.log(`deleted ${toDeleteIds.length} highlights`);
    } catch (error) {
      console.log("error deleting quotes");
      console.log(error);
    }
  }

  if (!dailyHighlights || (dailyHighlights?.length ?? 0) <= 0) {
    return (
      <div className="grid place-items-center ">
        <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-xl mb-2">Daily review</h1>
              <div className="max-w-[600px]">
                <p>No highlights available for daily review.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (reviewIsCompleted) {
    return (
      <div className="grid place-items-center ">
        <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-xl mb-2">Daily review</h1>
              <div className="max-w-[600px]">
                <p className="mb-4">You've completed your review for today.</p>
                {/* {starredIds.length > 0 && (
                  <p>Starred {starredIds.length} highlights</p>
                )} */}
                {toDeleteIds.length > 0 && (
                  <p>Deleted {toDeleteIds.length} highlights</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (activeHighlight) {
    return (
      <div className="dark:bg-netural-800 grid place-items-center ">
        <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-xl mb-4">Daily review</h1>
              <div className="max-w-[600px]">
                <DailyReviewButtons
                  activeHighlight={activeHighlight}
                  currentIndex={currentIndex}
                  onBack={handleBack}
                  onNext={handleNext}
                  onDelete={handleMarkForDelete}
                  toDeleteIds={toDeleteIds}
                  onStar={handleAddToStarred}
                  numberOfCards={dailyHighlights?.length}
                />
                <DailyReviewCard
                  bookId={activeHighlight.bookId}
                  text={activeHighlight.quote}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
