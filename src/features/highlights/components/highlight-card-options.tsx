import { deleteHighlight, getAllLists, getHighlight, getListsByIds, saveList, updateHighlight } from "../api";
import {
  useHighlightCardEditStore,
  useHighlightCardOptionsStore,
} from "../highlight-card-store";
import { List } from "@/lib/db/types";
import { useState } from "react";
import {
  BiDotsVerticalRounded,
  BiEditAlt,
  BiSolidTrash,
  BiBookOpen,
  BiListPlus,
  BiListMinus,
  BiSolidStar,
  BiStar,
} from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

interface HighlightCardProps {
  highlightId: number;
  bookId: number;
  starred: boolean;
  options?: CardOptions[];
}

export type CardOptions = "showRemove" | "hideDelete" | "hideStar";

export default function HighlightCardOptions({
  highlightId,
  bookId,
  starred,
  options = [],
}: HighlightCardProps) {
  const navigate = useNavigate();
  const { activeHighlightId, setActiveHighlightId } =
    useHighlightCardOptionsStore();
  const { editingHighlightId, setEditingHighlightId } =
    useHighlightCardEditStore();
  const isActive = activeHighlightId === highlightId;
  const isEditing = editingHighlightId === highlightId;
  const [isStarred, setIsStarred] = useState(starred);
  const [isShowingLists, setIsShowingLists] = useState(false);
  const [lists, setLists] = useState<List[] | null>(null);

  const showRemoveOption = options.includes("showRemove");
  const hideDeleteOption = options.includes("hideDelete");
  const hideStarOption = options.includes("hideStar");

  const { listId } = useParams();

  let cardOptions = [
    {
      icon: isStarred ? <BiSolidStar /> : <BiStar />,
      text: isStarred ? "Unstar" : "Star",
      action: () => handleStar(highlightId),
    },
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

  if (hideDeleteOption) {
    cardOptions = cardOptions.filter((option) => !(option.text === "Delete"));
  }

  if (hideStarOption) {
    cardOptions = cardOptions.filter(
      (option) => !(option.text === "Star" || option.text === "Unstar")
    );
  }

  async function handleStar(highlightId: number) {
    setIsStarred(!isStarred);
    const highlight = await getHighlight(highlightId);
    if (highlight) {
      await updateHighlight(highlightId, { starred: !starred });
    }
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
      const lists = await getAllLists();
      setLists(lists);
      setIsShowingLists(true);
    } else {
      await removeQuoteFromList(Number(listId));
    }
  }

  async function addQuoteToList(listId: number) {
    try {
      const list = await getListsByIds([listId]).then((lists) => lists[0]);
      console.log("🚀 ~ addQuoteToList ~ list:", list);
      if (list) {
        const isAlreadyAdded = await checkIfHighlightAlreadyAdded(
          highlightId,
          list
        );
        if (!isAlreadyAdded) {
          const updatedListHighlightIds = [...list.highlightIds, highlightId];
          const result = await saveList(listId, { highlightIds: updatedListHighlightIds });
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
      const list = await getListsByIds([listId]).then((lists) => lists[0]);
      if (list) {
        const updatedListHighlightIds = list.highlightIds.filter(
          (id) => id !== highlightId
        );
        const result = await saveList(listId, { highlightIds: updatedListHighlightIds });
        console.log(result);
      }
    } catch (error) {
      console.log("ERROR: Failed to remove item from list");
    }
  }

  return (
    <div className={`card-options relative shrink-0 ${isActive && "open"}`}>
      <button type="button" aria-label={`${isActive ? "Close" : "Open"} highlight options`} aria-expanded={isActive} className="grid min-h-11 min-w-11 place-items-center" onClick={handleOpen}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <ul className="bg-white dark:bg-neutral-900 dark:text-white pb-4 border border-black text-black p-2 absolute right-0 top-full z-10 min-w-[9rem] max-w-[calc(100vw-2rem)] w-max">
        {!isShowingLists &&
          cardOptions.map((option) => (
            <li
              key={option.text}
              className="border-b"
            >
              <button type="button" onClick={option.action} className="flex min-h-11 w-full items-center gap-2 p-1 text-left text-sm can-hover:hover:bg-neutral-600 can-hover:hover:text-white">
                {option.icon}
                {option.text}
              </button>
            </li>
          ))}
        {isShowingLists && (
          <>
            {lists?.map((list) => (
              <li
                key={list.id}
                className="border-b"
              >
                <button type="button" onClick={() => addQuoteToList(list.id)} className="flex min-h-11 w-full items-center gap-2 p-1 text-left can-hover:hover:bg-neutral-600 can-hover:hover:text-white">
                  <p>{list.name}</p>
                </button>
              </li>
            ))}
            <li
              className="border-b"
            >
              <button type="button" onClick={() => navigate("/lists")} className="flex min-h-11 w-full items-center gap-2 p-1 text-left can-hover:hover:bg-neutral-600 can-hover:hover:text-white">
                <p>+</p>
                <p>Add new list</p>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
