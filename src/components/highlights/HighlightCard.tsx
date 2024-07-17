interface HighlightCardProps {
  quote: string;
  bookTitle: string;
  bookAuthor: string;
}
export default function HighlightCard({
  quote,
  bookTitle,
  bookAuthor,
}: HighlightCardProps) {
  return (
    <div className="bg-white border-solid border border-black p-4">
      <p className="text-neutral-500">
        {bookTitle} - {bookAuthor}
      </p>
      <p>{quote}</p>
    </div>
  );
}
