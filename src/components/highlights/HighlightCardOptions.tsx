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
  BiListMinus,
} from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

interface HighlightCardProps {
  bookId: number;
  quoteId: number;
  options?: string[];
}

export default function HighlightCardOptions({
  bookId,
  quoteId,
  options = [],
}: HighlightCardProps) {
  const navigate = useNavigate();
  const { activeQuoteIds, setActiveQuoteIds } = useHighlightCardOptionsStore();
  const { editingQuoteIds, setEditingQutoeIds } = useHighlightCardEditStore();
  const isActive =
    activeQuoteIds?.bookId === bookId && activeQuoteIds?.quoteId === quoteId;
  const isEditing =
    editingQuoteIds?.bookId === bookId && editingQuoteIds.quoteId === quoteId;
  const [isShowingLists, setIsShowingLists] = useState(false);
  const [lists, setLists] = useState<List[] | null>(null);
  const showRemoveOption = options.includes("showRemove");
  const { listId } = useParams();

  let cardOptions = [
    {
      icon: <BiBookOpen />,
      text: "Go to book",
      action: () => {
        handleOpen();
        navigate(`/books/${bookId}`);
      },
    },
    {
      icon: !showRemoveOption ? <BiListPlus /> : <BiListMinus />,
      text: !showRemoveOption ? "Add to list" : "Remove",
      action: () => handleList(),
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

  if (showRemoveOption) {
    cardOptions = cardOptions.filter(
      (option) => !(option.text === "Edit" || option.text === "Delete")
    );
  }

  function handleOpen() {
    if (isActive) {
      setActiveQuoteIds(null);
    } else {
      setActiveQuoteIds({ bookId, quoteId });
    }
  }

  async function handleDeleteQuote(quoteId: number, bookId: number) {
    const book = await db.highlights.get(bookId);
    const updatedQuotes = book?.quotes.filter((quote) => quote.id !== quoteId);
    const result = await db.highlights.update(bookId, {
      quotes: updatedQuotes,
    });
    console.log(result);
    setActiveQuoteIds(null);
    setEditingQutoeIds(null);
  }

  async function handleEditQuote(quoteId: number) {
    if (isEditing) {
      setEditingQutoeIds(null);
    } else {
      setEditingQutoeIds({ bookId, quoteId });
    }
    handleOpen();
  }

  async function handleList() {
    if (!showRemoveOption) {
      const lists = await db.lists.toArray();
      setLists(lists);
      setIsShowingLists(true);
    } else {
      await removeQuoteFromList(Number(listId));
    }
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
          setActiveQuoteIds(null);
        } else {
          console.log("Quote is already added to list");
          setIsShowingLists(false);
          setActiveQuoteIds(null);
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

  async function removeQuoteFromList(listId: number) {
    try {
      const list = await db.lists.get(listId);
      console.log(list);
      if (list) {
        const updatedQuotes = list?.quotes.filter(
          (quote) => !(quote.id === quoteId && quote.bookId === bookId)
        );
        const result = await db.lists.update(listId, { quotes: updatedQuotes });
        console.log(result);
        navigate(0);
      }
    } catch (error) {
      console.log("ERROR: Failed to remove item from list");
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
              <div className="flex items-center gap-2 text-sm">
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
