import { type Highlight } from "@/types/types";
import { useEffect, useState } from "react";
import Button from "../Button";

interface DailyReviewButtonsProps {
  activeHighlight: Highlight | null;
  onStar: () => void;
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
  toDeleteIds,
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
    setIsStarred(!isStarred);
    onStar();
  }

  if (activeHighlight) {
    return (
      <div className="flex gap-2 flex-col sm:grid grid-cols-3 items-center justify-between mb-2">
        <div className="order-2 sm:order-none w-full grid grid-cols-2 gap-2">
          <Button
            text={isDeleted ? "undo" : "delete"}
            onClick={onDelete}
            className="lg:px-4 p-2"
          />

          <Button
            text={isStarred ? "starred" : "star"}
            onClick={handleStarClick}
            className="lg:px-4 p-2"
          />
        </div>
        <p className="text-center p-2 text-xl">
          {currentIndex + 1}/{numberOfCards}
        </p>
        <div className="order-last sm:order-none grid w-full grid-cols-2 gap-2">
          <Button text={"back"} onClick={onBack} className="lg:px-4 p-2" />
          <Button
            text={currentIndex + 1 === numberOfCards ? "finish" : "next"}
            onClick={onNext}
            className="lg:px-4 p-2"
          />
        </div>
      </div>
    );
  }
}
