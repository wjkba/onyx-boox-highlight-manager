import { db } from "@/db";
import {
  useHighlightCardEditStore,
  useHighlightCardOptionsStore,
} from "@/store";
import {
  BiDotsVerticalRounded,
  BiEditAlt,
  BiSolidTrash,
  BiBookOpen,
} from "react-icons/bi";
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
      icon: <BiBookOpen />,
      text: "Go to book",
      action: () => {
        handleOpen();
        navigate(`/books/${bookId}`);
      },
    },
    {
      icon: <BiEditAlt />,
      text: "Edit",
      action: () => handleEditQuote(quoteId),
    },
    {
      icon: <BiSolidTrash />,
      text: "Delete",
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
    setActiveQuoteId(null);
    setEditingQutoeId(null);
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
      <ul className="bg-white dark:bg-neutral-900 dark:text-white pb-4 border border-black text-black p-2 absolute max-w-[9rem] w-full  -translate-x-[6.4rem]">
        {cardOptions.map((option, index) => (
          <li
            key={index}
            onClick={option.action}
            className=" cursor-pointer border-b p-1 hover:bg-neutral-600 hover:text-white"
          >
            <div className="flex items-center gap-2">
              {option.icon}
              {option.text}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
