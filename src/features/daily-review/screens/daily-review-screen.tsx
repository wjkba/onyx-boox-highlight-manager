import Navbar from "@/components/layout/navbar";
import { completeDailyReview, setHighlightStarred } from "../api";
import { useReviewBook } from "../hooks";
import {
  getDailyReviewQuotes,
  isDailyReviewCompleted,
  updateStreak,
} from "../api";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isStarUpdating, setIsStarUpdating] = useState(false);
  const starMutationInFlight = useRef(false);
  const [streakCount, setStreakCount] = useState(0);
  const navigate = useNavigate();
  const activeBook = useReviewBook(activeHighlight?.bookId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchDaily = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setActionError(null);

    try {
      const daily = await getDailyReviewQuotes();
      setReviewIsCompleted(isDailyReviewCompleted());
      setDailyHighlights(daily);
      setActiveHighlight(daily[0] ?? null);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Failed to fetch daily highlights:", error);
      setLoadError("We couldn’t load today’s review. Try again or import more highlights.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDaily();
  }, [fetchDaily]);

  async function handleNext() {
    if (dailyHighlights && !isFinishing && !isStarUpdating) {
      const nextIndex = currentIndex + 1;
      if (nextIndex > dailyHighlights.length - 1) {
        setIsFinishing(true);
        setActionError(null);
        try {
          await updateReviewedQuotes();
          const now = new Date();
          updateStreak();
          localStorage.setItem("lastDailyReview", now.toISOString());
          localStorage.setItem("isReviewCompleted", "true");
          setStreakCount(Number(localStorage.getItem("streakCount") ?? 0));
          setReviewIsCompleted(true);
        } catch (error) {
          console.error("Failed to finish daily review:", error);
          setActionError("Your review could not be saved. Try finishing again.");
        } finally {
          setIsFinishing(false);
        }
      } else {
        setActiveHighlight(dailyHighlights[nextIndex]);
        setCurrentIndex(nextIndex);
      }
    }
  }

  function handleBack() {
    if (dailyHighlights && !isFinishing && !isStarUpdating) {
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
    if (activeHighlight && !isStarUpdating && !starMutationInFlight.current) {
      const starred = !activeHighlight.starred;
      starMutationInFlight.current = true;
      setIsStarUpdating(true);
      setActionError(null);
      try {
        await setHighlightStarred(activeHighlight.id, starred);
        const updatedDailyHighlights = dailyHighlights?.map((highlight) =>
          highlight.id === activeHighlight.id ? { ...highlight, starred } : highlight,
        );
        if (updatedDailyHighlights) setDailyHighlights(updatedDailyHighlights);
        setActiveHighlight({ ...activeHighlight, starred });
        setActionStatus(starred ? "Highlight starred." : "Highlight unstarred.");
      } catch (error) {
        console.error("Failed to update starred highlight:", error);
        setActionError("The star could not be saved. Try again.");
      } finally {
        starMutationInFlight.current = false;
        setIsStarUpdating(false);
      }
    }
  }
  function handleMarkForDelete() {
    if (activeHighlight && !isStarUpdating && !isFinishing) {
      const activeHighlightId = activeHighlight.id;
      if (!toDeleteIds.includes(activeHighlightId)) {
        setToDeleteIds((s) => [...s, activeHighlightId]);
        setActionStatus("Highlight marked for deletion. Select undo to keep it.");
        return;
      }
      setToDeleteIds((s) => s.filter((id) => id !== activeHighlightId));
      setActionStatus("Highlight kept.");
    }
  }

  async function updateReviewedQuotes() {
    const newReviewedDate = new Date().toISOString();
    if (!dailyHighlights) throw new Error("No daily highlights loaded");
    await completeDailyReview(
      dailyHighlights.map(({ id }) => id),
      newReviewedDate,
      toDeleteIds,
    );
  }

  if (isLoading) {
    return (
      <div className="grid place-items-center" aria-busy="true">
        <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-2xl font-medium mb-6">Daily review</h1>
              <div className="max-w-[600px] border border-stone-400 dark:border-stone-500 p-6">
                <output aria-live="polite" className="font-literata text-lg">Loading today’s highlights…</output>
                <div className="mt-6 grid gap-3" aria-hidden="true">
                  <div className="h-3 w-1/3 bg-stone-200 dark:bg-neutral-700" />
                  <div className="h-3 w-full bg-stone-200 dark:bg-neutral-700" />
                  <div className="h-3 w-4/5 bg-stone-200 dark:bg-neutral-700" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="grid place-items-center">
        <div className="w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-2xl font-medium mb-4">Daily review</h1>
              <section className="max-w-[600px] border border-stone-400 dark:border-stone-500 p-6" aria-labelledby="review-error-title">
                <h2 id="review-error-title" className="text-lg font-medium mb-2">Review unavailable</h2>
                <p className="max-w-prose mb-6">{loadError}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button text="Try again" onClick={fetchDaily} className="!bg-neutral-900 !text-white dark:!bg-neutral-100 dark:!text-black p-3" />
                  <Button text="Import highlights" onClick={() => navigate("/import")} className="!border-transparent p-3" />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!reviewIsCompleted && (!dailyHighlights || dailyHighlights.length === 0)) {
    return (
      <div className="grid place-items-center">
        <div className="w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-2xl font-medium mb-4">Daily review</h1>
              <section className="max-w-[600px] border border-stone-400 dark:border-stone-500 p-6" aria-labelledby="review-empty-title">
                <h2 id="review-empty-title" className="text-lg font-medium mb-2">Nothing is due today</h2>
                <p className="max-w-prose mb-6">Import more highlights or return tomorrow for another quiet reading session.</p>
                <Button text="Import highlights" onClick={() => navigate("/import")} className="!bg-neutral-900 !text-white dark:!bg-neutral-100 dark:!text-black p-3 w-full sm:w-auto" />
              </section>
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
              <div className="max-w-[600px] border border-stone-400 dark:border-stone-500 p-6">
                <div className="grid gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <BiSolidFlame size={16} />
                    <p>Streak: {streakCount || Number(localStorage.getItem("streakCount") ?? 0)}</p>
                  </div>
                  <output aria-live="polite">You’ve completed your review for today.</output>
                  {toDeleteIds.length > 0 && (
                    <p>Deleted {toDeleteIds.length} highlights</p>
                  )}
                </div>
                <Button
                  text="Return to home"
                  onClick={() => navigate("/")}
                  className="w-full lg:max-w-[300px] !bg-neutral-900 !text-white dark:!bg-neutral-100 dark:!text-black p-3"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (activeHighlight && dailyHighlights) {
    return (
      <div className="grid place-items-center">
        <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <div className="max-w-[600px] mb-16">
                <div className="mb-8 flex items-baseline justify-between gap-4">
                  <h1 className="text-lg font-medium">Daily review</h1>
                  <output className="shrink-0 text-xs tabular-nums text-neutral-600 dark:text-neutral-300" aria-live="polite">
                    Highlight {currentIndex + 1} of {dailyHighlights.length}
                  </output>
                </div>
                {actionError && <p className="mb-4 text-sm text-red-700 dark:text-red-300" role="alert">{actionError}</p>}
                {actionStatus && <output className="sr-only" aria-live="polite">{actionStatus}</output>}
                <DailyReviewButtonsComponent
                  activeHighlight={activeHighlight}
                  currentIndex={currentIndex}
                  onBack={handleBack}
                  onNext={handleNext}
                  onDelete={handleMarkForDelete}
                  toDeleteIds={toDeleteIds}
                  onStar={handleAddToStarred}
                  numberOfCards={dailyHighlights?.length}
                  isFinishing={isFinishing}
                  isStarUpdating={isStarUpdating}
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
