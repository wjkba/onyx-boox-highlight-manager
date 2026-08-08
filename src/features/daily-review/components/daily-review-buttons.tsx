import { type Highlight } from "@/lib/db/types";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";

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

  if (activeHighlight) {
    return (
      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isFinishing || isStarUpdating}
          aria-pressed={isDeleted}
          className="w-full min-w-0"
        >
          {isDeleted ? "Undo delete" : "Delete"}
        </Button>

        <Button
          variant="ghost"
          onClick={handleStarClick}
          disabled={isFinishing || isStarUpdating}
          aria-pressed={isStarred}
          aria-label={isStarred ? "Unstar highlight" : "Star highlight"}
          className="w-full min-w-0"
        >
          {isStarred ? "Starred" : "Star"}
        </Button>

        <Button
          variant="ghost"
          onClick={onBack}
          disabled={currentIndex === 0 || isFinishing || isStarUpdating}
          className="w-full min-w-0"
        >
          Back
        </Button>

        <Button
          variant="primary"
          onClick={onNext}
          disabled={isFinishing || isStarUpdating}
          className="w-full min-w-0"
        >
          {isFinishing ? "Saving…" : currentIndex + 1 === numberOfCards ? "Finish" : "Next"}
        </Button>
      </div>
    );
  }
}
