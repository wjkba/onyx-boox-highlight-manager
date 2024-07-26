import Navbar from "@/components/Navbar";
import { db } from "@/db";
import { DailyReviewQuote } from "@/types/types";
import { getDailyReviewQuotes } from "@/utils/dailyReview";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

export default function DailyReviewPage() {
  const books = useLiveQuery(() => db.highlights.toArray());

  const [dailyHighlights, setDailyHighlights] = useState<
    DailyReviewQuote[] | null
  >(null);
  const [activeHighlight, setActiveHighlight] =
    useState<DailyReviewQuote | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        return;
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

  return (
    <div className="grid place-items-center ">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="bg-white min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
          <div className="lg:w-full">
            <h1 className="text-xl mb-2">DailyReviewPage</h1>
            <div className="max-w-[600px]">
              <div>
                <button onClick={handleBack} className="bg-pink-200 px-4 p-2">
                  back
                </button>
                <button onClick={handleNext} className="bg-pink-200 px-4 p-2">
                  next
                </button>
              </div>
              <div className="mb-1">
                <p>ID: {activeHighlight && activeHighlight.id}</p>
              </div>
              <p>{activeHighlight && activeHighlight.text}</p>
            </div>
          </div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
}
