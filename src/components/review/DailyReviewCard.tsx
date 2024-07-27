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
    <div className="max-w-[600px] border border-black">
      <div className="bg-black w-full text-white min-h-[56px] flex items-center p-4">
        <p>
          {bookTitle} - {bookAuthor}
        </p>
      </div>
      <p className="p-4">{text}</p>
    </div>
  );
}
