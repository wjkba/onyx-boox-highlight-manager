import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface HighlightCardProps {
  bookId: number;
  quoteId: number;
}

export default function HighlightCardOptions({
  bookId,
  quoteId,
}: HighlightCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const cardOptions = [
    {
      text: "Go to book",
      action: () => {
        navigate(`/books/${bookId}`);
      },
    },
    {
      text: "Delete highlight",
      action: () => handleDeleteQuote(quoteId, bookId),
    },
  ];

  function handleOpen() {
    setIsOpen(!isOpen);
  }

  function handleDeleteQuote(quoteId, bookId) {
    // TODO: dodaj delete
    console.log("delete");
  }

  return (
    <div className={`card-options ${isOpen && "open"}`}>
      <button className="grid place-items-center " onClick={handleOpen}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <ul className="bg-white border border-black text-black p-2 absolute min-w-[8rem]  -translate-x-[6.4rem]">
        {cardOptions.map((option, index) => (
          <li
            key={index}
            onClick={option.action}
            className=" cursor-pointer p-1 hover:bg-neutral-600 hover:text-white"
          >
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
