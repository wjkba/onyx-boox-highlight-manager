import DailyReviewCard from "@/components/review/DailyReviewCard";
import Navbar from "@/components/Navbar";
import { db } from "@/db";
import { DailyReviewQuote } from "@/types/types";
import { getDailyReviewQuotes } from "@/utils/dailyReview";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import DailyReviewButtons from "@/components/review/DailyReviewButtons";

export default function DailyReviewPage() {
  const books = useLiveQuery(() => db.highlights.toArray());

  const [dailyHighlights, setDailyHighlights] = useState<
    DailyReviewQuote[] | null
  >(null);
  const [activeHighlight, setActiveHighlight] =
    useState<DailyReviewQuote | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewIsCompleted, setReviewIsCompleted] = useState<boolean>(false);
  const [starredIds, setStarredIds] = useState<number[]>([]);
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
  }, []);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const daily = await getDailyReviewQuotes(books!);
        if (daily) {
          setDailyHighlights(daily);
          setActiveHighlight(daily[0]);
        }
      } catch (error) {
        console.error("Failed to fetch daily highlights:", error);
      }
    };
    fetchDaily();
  }, [books]);

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
      console.log(dailyHighlights[nextIndex]);
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
  function handleAddToStarred() {
    const activeHighlightId = Number(activeHighlight?.id.split("/")[1]);
    if (!starredIds.includes(activeHighlightId)) {
      setStarredIds((s) => [...s, activeHighlightId]);
      return;
    }
    setStarredIds((s) => s.filter((id) => id !== activeHighlightId));
  }
  function handleMarkForDelete() {
    const activeHighlightId = Number(activeHighlight?.id.split("/")[1]);
    if (!toDeleteIds.includes(activeHighlightId)) {
      setToDeleteIds((s) => [...s, activeHighlightId]);
      return;
    }
    setToDeleteIds((s) => s.filter((id) => id !== activeHighlightId));
  }

  async function updateReviewedQuotes() {
    try {
      const ids = dailyHighlights?.map((highlight) => ({
        bookId: Number(highlight.id.split("/")[0]),
        quoteId: highlight.id.split("/")[1],
      }));
      const uniqueBookIds = Array.from(new Set(ids?.map((id) => id.bookId)));

      if (books) {
        const now = new Date();
        for (let x in uniqueBookIds) {
          const bookId = uniqueBookIds[x];
          const bookIndex = books.findIndex((book) => book.id === bookId);
          if (bookIndex !== -1) {
            const book = books[bookIndex];
            let updatedQuotes = book.quotes.map((quote) => {
              const quoteId = ids?.find(
                (id) => id.bookId === bookId && Number(id.quoteId) === quote.id
              );
              if (quoteId) {
                const isStarred = starredIds.includes(Number(quoteId.quoteId));
                if (isStarred) {
                  return {
                    ...quote,
                    lastReviewed: now.toISOString(),
                    starred: true,
                  };
                } else {
                  return { ...quote, lastReviewed: now.toISOString() };
                }
              } else {
                return quote;
              }
            });
            updatedQuotes = updatedQuotes.filter(
              (quote) => !toDeleteIds.includes(Number(quote.id))
            );
            console.log(updatedQuotes);
            const result = await db.highlights.update(bookId, {
              quotes: updatedQuotes,
            });
            console.log(result);
          }
        }
      }
    } catch (error) {
      console.log("error updating reviewed quotes");
      console.log(error);
    }
  }

  if (dailyHighlights === undefined || (dailyHighlights?.length ?? 0) <= 0) {
    return (
      <div className="grid place-items-center ">
        <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="bg-white min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-xl mb-2">Daily review</h1>
              <div className="max-w-[600px]">
                <p>No highlights available.</p>
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
          <main className="bg-white min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
            <div className="lg:w-full">
              <h1 className="text-xl mb-2">Daily review</h1>
              <div className="max-w-[600px]">
                <p className="mb-4">You've completed your review for today.</p>
                {starredIds.length > 0 && (
                  <p>Starred {starredIds.length} highlights</p>
                )}
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
      <div className="grid place-items-center ">
        <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
          <Navbar />
          <main className="bg-white min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
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
                  starredIds={starredIds}
                  numberOfCards={dailyHighlights?.length}
                />
                <DailyReviewCard
                  bookTitle={activeHighlight.bookTitle}
                  bookAuthor={activeHighlight.bookAuthor}
                  text={activeHighlight.text}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
