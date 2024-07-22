import { db } from "@/db";
import {
  useHighlightCardEditStore,
  useHighlightCardOptionsStore,
} from "@/store";
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
  const navigate = useNavigate();
  const { activeQuoteId, setActiveQuoteId } = useHighlightCardOptionsStore();
  const { editingQuoteId, setEditingQutoeId } = useHighlightCardEditStore();
  const isActive = activeQuoteId === quoteId;
  const isEditing = editingQuoteId === quoteId;

  const cardOptions = [
    {
      text: "Go to book",
      action: () => {
        navigate(`/books/${bookId}`);
      },
    },
    {
      text: "Edit",
      action: () => handleEditQuote(quoteId),
    },
    {
      text: "Delete highlight",
      action: () => handleDeleteQuote(quoteId, bookId),
    },
  ];

  function handleOpen() {
    if (isActive) {
      setActiveQuoteId(null);
    } else {
      setActiveQuoteId(quoteId);
    }
  }

  async function handleDeleteQuote(quoteId: number, bookId: number) {
    const book = await db.highlights.get(bookId);
    const updatedQuotes = book?.quotes.filter((quote) => quote.id !== quoteId);
    const result = await db.highlights.update(bookId, {
      quotes: updatedQuotes,
    });
    console.log(result);
    handleOpen();
  }

  async function handleEditQuote(quoteId: number) {
    if (isEditing) {
      setEditingQutoeId(null);
    } else {
      setEditingQutoeId(quoteId);
    }
    handleOpen();
  }

  return (
    <div className={`card-options ${isActive && "open"}`}>
      <button className="grid place-items-center " onClick={handleOpen}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <ul className="bg-white pb-4 border border-black text-black p-2 absolute max-w-[9rem] w-full  -translate-x-[6.4rem]">
        {cardOptions.map((option, index) => (
          <li
            key={index}
            onClick={option.action}
            className=" cursor-pointer border-b p-1 hover:bg-neutral-600 hover:text-white"
          >
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
