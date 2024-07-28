type DailyReviewCardProps = {
  bookTitle: string;
  bookAuthor: string;
  text: string;
};

export default function DailyReviewCard({
  bookTitle,
  bookAuthor,
  text,
}: DailyReviewCardProps) {
  return (
    <div className="max-w-[600px] border dark:border-white border-black">
      <div className="dark:bg-neutral-100 dark:text-black bg-neutral-900 w-full text-white min-h-[56px] flex items-center p-4">
        <p>
          {bookTitle} - {bookAuthor}
        </p>
      </div>
      <p className="p-4 font-robotoSlab">{text}</p>
    </div>
  );
}
