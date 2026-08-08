import type { Book } from "@/lib/db/types";

type DailyReviewCardProps = {
  book?: Book;
  text: string;
};

export default function DailyReviewCard({
  book,
  text,
}: DailyReviewCardProps) {
  return (
    <article className="border-y border-stone-400 py-8 dark:border-stone-500 sm:py-10">
      <p className="mb-6 max-w-prose text-sm text-neutral-600 dark:text-neutral-300">
        <cite className="not-italic">
          {book ? `${book.bookTitle} · ${book.bookAuthor}` : "Book details unavailable"}
        </cite>
      </p>
      <blockquote className="max-w-prose font-literata text-[1.2rem] leading-[1.7] sm:text-[1.35rem]">
        {text}
      </blockquote>
    </article>
  );
}
