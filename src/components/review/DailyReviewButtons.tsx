import { type DailyReviewQuote } from "@/types/types";
import { useEffect, useState } from "react";

interface DailyReviewButtonsProps {
  activeHighlight: DailyReviewQuote | null;
  onStar: () => void;
  starredIds: number[] | null;
  onDelete: () => void;
  toDeleteIds: number[] | null;
  currentIndex: number;
  onBack: () => void;
  onNext: () => void;
  numberOfCards: number | undefined;
}
export default function DailyReviewButtons({
  activeHighlight,
  onStar,
  onDelete,
  currentIndex,
  onBack,
  onNext,
  numberOfCards,
  starredIds,
  toDeleteIds,
}: DailyReviewButtonsProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  useEffect(() => {
    if (activeHighlight) {
      const activeHighlightId = Number(activeHighlight?.id.split("/")[1]);
      if (starredIds?.includes(activeHighlightId)) {
        setIsStarred(true);
      } else {
        setIsStarred(false);
      }
      if (toDeleteIds?.includes(activeHighlightId)) {
        setIsDeleted(true);
      } else {
        setIsDeleted(false);
      }
    }
  }, [starredIds, toDeleteIds, activeHighlight]);

  if (activeHighlight) {
    return (
      <div className="flex justify-between mb-2">
        <div className="flex gap-2">
          <button
            onClick={onDelete}
            className="border border-black hover:text-white hover:bg-black px-4 p-2"
          >
            {isDeleted ? "deleted" : "delete"}
          </button>
          <button
            onClick={onStar}
            className="border border-black hover:text-white hover:bg-black px-4 p-2"
          >
            {isStarred ? "starred" : "star"}
          </button>
        </div>
        <p>
          {currentIndex + 1}/{numberOfCards}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="border border-black hover:text-white hover:bg-black px-4 p-2"
          >
            back
          </button>
          <button
            onClick={onNext}
            className="border border-black hover:text-white hover:bg-black px-4 p-2"
          >
            next
          </button>
        </div>
      </div>
    );
  }
}
