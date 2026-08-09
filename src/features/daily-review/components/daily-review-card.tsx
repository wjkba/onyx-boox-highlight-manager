import type { Book } from "@/lib/db/types";
import type { MouseEvent } from "react";
import { BiDotsHorizontalRounded, BiSolidStar, BiStar } from "react-icons/bi";
import Button from "@/components/ui/button";

type DailyReviewCardProps = {
  book?: Book;
  text: string;
  starred: boolean;
  onStar: () => void | Promise<void>;
  onDelete: () => void;
  isDeleted: boolean;
  isFinishing: boolean;
  isStarUpdating: boolean;
};

export default function DailyReviewCard({
  book,
  text,
  starred,
  onStar,
  onDelete,
  isDeleted,
  isFinishing,
  isStarUpdating,
}: DailyReviewCardProps) {
  function handleDeleteClick(event: MouseEvent<HTMLButtonElement>) {
    onDelete();
    event.currentTarget.closest("details")?.removeAttribute("open");
  }

  return (
    <article className="py-4 lg:py-3">
      <div className="mb-4 flex items-center justify-between gap-4 lg:mb-3">
        <p className="min-w-0 max-w-prose text-sm text-neutral-600 dark:text-neutral-300">
          <cite className="not-italic">
            {book
              ? `${book.bookTitle} · ${book.bookAuthor}`
              : "Book details unavailable"}
          </cite>
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => void onStar()}
            disabled={isFinishing || isStarUpdating}
            aria-pressed={starred}
            aria-label={starred ? "Unstar highlight" : "Star highlight"}
            className="grid size-11 place-items-center text-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:focus-visible:outline-neutral-100"
          >
            {starred ? (
              <BiSolidStar aria-hidden="true" size={19} />
            ) : (
              <BiStar aria-hidden="true" size={19} />
            )}
          </button>

          <details className="relative">
            <summary className="grid size-11 cursor-pointer list-none place-items-center text-neutral-600 marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-300 dark:focus-visible:outline-neutral-100">
              <span className="sr-only">More highlight actions</span>
              <BiDotsHorizontalRounded aria-hidden="true" size={21} />
            </summary>
            <div className="absolute right-0 top-full z-10 mt-1 w-max min-w-44 border border-stone-400 bg-white p-1 dark:border-stone-500 dark:bg-neutral-900">
              <Button
                variant="ghost"
                type="button"
                onClick={handleDeleteClick}
                disabled={isFinishing || isStarUpdating}
                aria-pressed={isDeleted}
                aria-label={
                  isDeleted
                    ? "Undo delete for highlight"
                    : "Mark highlight for deletion"
                }
                className="w-full justify-start px-3 text-left text-sm"
              >
                {isDeleted ? "Undo delete" : "Delete highlight"}
              </Button>
            </div>
          </details>
        </div>
      </div>
      <blockquote className="max-w-prose text-pretty font-literata text-base leading-[1.7] sm:text-lg lg:max-w-[44rem]">
        {text}
      </blockquote>
    </article>
  );
}
