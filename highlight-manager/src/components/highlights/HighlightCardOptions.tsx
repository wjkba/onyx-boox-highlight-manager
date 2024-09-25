import { db, deleteHighlight } from "@/db";
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
  highlightId: number;
  bookId: number;
  options?: string[];
}

export default function HighlightCardOptions({
  highlightId,
  bookId,
  options = [],
}: HighlightCardProps) {
  const navigate = useNavigate();
  const { activeHighlightId, setActiveHighlightId } =
    useHighlightCardOptionsStore();
  const { editingHighlightId, setEditingHighlightId } =
    useHighlightCardEditStore();
  const isActive = activeHighlightId === highlightId;
  const isEditing = editingHighlightId === highlightId;
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
      action: () => handleEditHighlight(highlightId),
    },
    {
      icon: <BiSolidTrash />,
      text: "Delete",
      action: () => handleDeleteHighlight(highlightId),
    },
  ];

  if (showRemoveOption) {
    cardOptions = cardOptions.filter(
      (option) => !(option.text === "Edit" || option.text === "Delete")
    );
  }

  function handleOpen() {
    if (isActive) {
      setActiveHighlightId(null);
    } else {
      setActiveHighlightId(highlightId);
    }
  }

  async function handleDeleteHighlight(highlightId: number) {
    await deleteHighlight(highlightId);
    setActiveHighlightId(null);
    setEditingHighlightId(null);
  }

  async function handleEditHighlight(highlightId: number) {
    if (isEditing) {
      setEditingHighlightId(null);
    } else {
      setEditingHighlightId(highlightId);
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
      const list = await db.lists.get(listId);
      console.log("🚀 ~ addQuoteToList ~ list:", list);
      if (list) {
        const isAlreadyAdded = await checkIfHighlightAlreadyAdded(
          highlightId,
          list
        );
        if (!isAlreadyAdded) {
          const updatedListHighlightIds = [...list.highlightIds, highlightId];
          const result = await db.lists
            .where("id")
            .equals(listId)
            .modify({ highlightIds: updatedListHighlightIds });
          console.log("🚀 ~ addQuoteToList ~ result:", result);
          setIsShowingLists(false);
          setActiveHighlightId(null);
        } else {
          console.log("Quote is already added to list");
          setIsShowingLists(false);
          setActiveHighlightId(null);
        }
      }
    } catch (error) {
      console.log(error);
      console.log("ERROR: Failed to add quote to this list");
    }
    async function checkIfHighlightAlreadyAdded(
      highlightId: number,
      list: List
    ) {
      const found = list.highlightIds.find((id) => id === highlightId);
      if (found) return true;
      else return false;
    }
  }

  async function removeQuoteFromList(listId: number) {
    try {
      const list = await db.lists.get(listId);
      if (list) {
        const updatedListHighlightIds = list.highlightIds.filter(
          (id) => id !== highlightId
        );
        const result = await db.lists.update(listId, {
          highlightIds: updatedListHighlightIds,
        });
        console.log(result);
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
