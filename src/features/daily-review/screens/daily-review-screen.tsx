import Navbar from "@/components/layout/navbar";
import { deleteHighlights, setHighlightStarred, markHighlightsReviewed } from "../api";
import { useReviewBook } from "../hooks";
import {
  getDailyReviewQuotes,
  isDailyReviewCompleted,
  updateStreak,
} from "../api";
import { useEffect, useState } from "react";
import { Highlight } from "@/lib/db/types";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { ElementType } from "react";
import { BiSolidFlame } from "react-icons/bi";

export default function DailyReviewPage({
  DailyReviewButtonsComponent,
  HighlightCardComponent,
}: {
  DailyReviewButtonsComponent: ElementType;
  HighlightCardComponent: ElementType;
}) {
  const [dailyHighlights, setDailyHighlights] = useState<Highlight[] | null>(
    null
  );
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewIsCompleted, setReviewIsCompleted] = useState<boolean>(false);
  const [toDeleteIds, setToDeleteIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const activeBook = useReviewBook(activeHighlight?.bookId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [reviewIsCompleted]);

  // SCREEN CAFFEINE
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      if ("wakeLock" in navigator) {
        wakeLock = await navigator.wakeLock.request("screen");
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, []);

  // ---

  useEffect(() => {
    const isCompleted = isDailyReviewCompleted();
    setReviewIsCompleted(isCompleted);

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
        updateStreak();
        localStorage.setItem("lastDailyReview", now.toISOString());
        localStorage.setItem("isReviewCompleted", "true");
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
    }
  }
  async function handleAddToStarred() {
    if (activeHighlight) {
      await setHighlightStarred(activeHighlight.id, !activeHighlight.starred);
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
        await markHighlightsReviewed(reviewedHighlights.map(({ id }) => id), newReviewedDate);
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
                <div className="grid gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <BiSolidFlame size={16} />
                    <p>Streak: </p>
                    <p>{localStorage.getItem("streakCount")}</p>
                  </div>
                  <p>You've completed your review for today.</p>
                  {toDeleteIds.length > 0 && (
                    <p>Deleted {toDeleteIds.length} highlights</p>
                  )}
                </div>
                <Button
                  text="Return to home"
                  onClick={() => navigate("/")}
                  className="w-full lg:max-w-[300px] p-2"
                />
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
              {/* <h1 className="text-xl mb-4">Daily review</h1> */}
              <div className="max-w-[600px] mb-16">
                <DailyReviewButtonsComponent
                  activeHighlight={activeHighlight}
                  currentIndex={currentIndex}
                  onBack={handleBack}
                  onNext={handleNext}
                  onDelete={handleMarkForDelete}
                  toDeleteIds={toDeleteIds}
                  onStar={handleAddToStarred}
                  numberOfCards={dailyHighlights?.length}
                />
                <HighlightCardComponent
                  key={`${activeHighlight.id}-${currentIndex}`}
                  bookId={activeHighlight.bookId}
                  id={activeHighlight.id}
                  starred={activeHighlight.starred}
                  text={activeHighlight.quote}
                  book={activeBook}
                  options={["hideDelete", "hideStar"]}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
