import Button from "@/components/ui/button";

interface DailyReviewButtonsProps {
  currentIndex: number;
  onBack: () => void;
  onNext: () => void;
  numberOfCards: number | undefined;
  isFinishing?: boolean;
  isStarUpdating?: boolean;
}
export default function DailyReviewButtons({
  currentIndex,
  onBack,
  onNext,
  numberOfCards,
  isFinishing = false,
  isStarUpdating = false,
}: DailyReviewButtonsProps) {
  return (
    <nav
      aria-label="Review navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-300 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 dark:border-stone-600 dark:bg-neutral-900 sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 lg:mt-4"
    >
      <div className="mx-auto grid w-full max-w-[20rem] grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={currentIndex === 0 || isFinishing || isStarUpdating}
          className="h-11 w-full min-w-0 whitespace-nowrap px-2"
        >
          Back
        </Button>

        <Button
          variant="primary"
          onClick={onNext}
          disabled={isFinishing || isStarUpdating}
          className="h-11 w-full min-w-0 whitespace-nowrap px-2"
        >
          {isFinishing ? "Saving…" : currentIndex + 1 === numberOfCards ? "Finish" : "Next"}
        </Button>
      </div>
    </nav>
  );
}
