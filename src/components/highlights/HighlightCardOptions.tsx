import { db } from "@/db";
import {
  useHighlightCardEditStore,
  useHighlightCardOptionsStore,
} from "@/store";
import { List } from "@/types/types";
import { useState } from "react";
import {
  BiDotsVerticalRounded,
  BiEditAlt,
  BiSolidTrash,
  BiBookOpen,
  BiListPlus,
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
  const [isShowingLists, setIsShowingLists] = useState(false);
  const [lists, setLists] = useState<List[] | null>(null);

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
      icon: <BiListPlus />,
      text: "Add to list",
      action: () => handleAddToList(),
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

  async function handleAddToList() {
    const lists = await db.lists.toArray();
    setLists(lists);
    setIsShowingLists(true);
  }

  async function addQuoteToList(listId: number) {
    try {
      const book = await db.highlights.get(bookId);
      const quote = book?.quotes.find((quote) => quote.id === quoteId);
      const list = await db.lists.get(listId);
      if (list && quote && book && quote) {
        const updatedQuote = {
          ...quote,
          bookAuthor: book.bookAuthor,
          bookTitle: book.bookTitle,
          bookId: bookId,
        };
        const isAlreadyAdded = checkIfQuoteAlreadyAdded(quoteId, bookId, list);
        if (!isAlreadyAdded) {
          const updatedQuotes = [...list.quotes, updatedQuote];
          await db.lists.update(listId, { quotes: updatedQuotes });
          setIsShowingLists(false);
          setActiveQuoteId(null);
        } else {
          console.log("Quote is already added to list");
          setIsShowingLists(false);
          setActiveQuoteId(null);
        }
      }
    } catch (error) {
      console.log("ERROR: Failed to add quote to this list");
    }

    function checkIfQuoteAlreadyAdded(
      quoteId: number,
      bookId: number,
      list: List
    ) {
      const result = list.quotes.filter(
        (quote) => quote.id === quoteId && quote.bookId === bookId
      );
      if (result.length === 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  return (
    <div className={`card-options ${isActive && "open"}`}>
      <button className="grid place-items-center " onClick={handleOpen}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <ul className="bg-white dark:bg-neutral-900 dark:text-white pb-4 border border-black text-black p-2 absolute max-w-[9rem] w-full  -translate-x-[6.4rem]">
        {!isShowingLists &&
          cardOptions.map((option, index) => (
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
        {isShowingLists && (
          <>
            {lists?.map((list) => (
              <li
                key={list.id}
                onClick={() => addQuoteToList(list.id)}
                className="cursor-pointer border-b p-1 hover:bg-neutral-600 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <p>{list.name}</p>
                </div>
              </li>
            ))}
            <li
              onClick={() => navigate("/lists")}
              className="cursor-pointer border-b p-1 hover:bg-neutral-600 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <p>+</p>
                <p>Add new list</p>
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
