import { type Highlight } from "@/lib/db/types";
import { useEffect, useState } from "react";

interface DailyReviewButtonsProps {
  activeHighlight: Highlight | null;
  onStar: () => void | Promise<void>;
  onDelete: () => void;
  toDeleteIds: number[] | null;
  currentIndex: number;
  onBack: () => void;
  onNext: () => void;
  numberOfCards: number | undefined;
  isFinishing?: boolean;
  isStarUpdating?: boolean;
}
export default function DailyReviewButtons({
  activeHighlight,
  onStar,
  onDelete,
  currentIndex,
  onBack,
  onNext,
  numberOfCards,
  toDeleteIds,
  isFinishing = false,
  isStarUpdating = false,
}: DailyReviewButtonsProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (activeHighlight) {
      if (activeHighlight.starred) setIsStarred(true);
      else setIsStarred(false);
      if (toDeleteIds?.includes(activeHighlight.id)) setIsDeleted(true);
      else setIsDeleted(false);
    }
  }, [toDeleteIds, activeHighlight]);

  function handleStarClick() {
    if (!isStarUpdating) void onStar();
  }

  const quietButtonClass =
    "min-h-11 w-full min-w-0 border-transparent px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 can-hover:hover:border-stone-300 can-hover:dark:hover:border-stone-600";
  const primaryButtonClass =
    "min-h-11 w-full min-w-0 border-neutral-900 bg-neutral-900 px-4 py-2 text-sm text-white can-hover:hover:bg-neutral-700 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 can-hover:dark:hover:bg-neutral-300";

  if (activeHighlight) {
    return (
      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={onDelete}
          disabled={isFinishing || isStarUpdating}
          aria-pressed={isDeleted}
          className={quietButtonClass}
        >
          {isDeleted ? "Undo delete" : "Delete"}
        </button>

        <button
          type="button"
          onClick={handleStarClick}
          disabled={isFinishing || isStarUpdating}
          aria-pressed={isStarred}
          aria-label={isStarred ? "Unstar highlight" : "Star highlight"}
          className={quietButtonClass}
        >
          {isStarred ? "Starred" : "Star"}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={currentIndex === 0 || isFinishing || isStarUpdating}
          className={quietButtonClass}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isFinishing || isStarUpdating}
          className={primaryButtonClass}
        >
          {isFinishing ? "Saving…" : currentIndex + 1 === numberOfCards ? "Finish" : "Next"}
        </button>
      </div>
    );
  }
}
