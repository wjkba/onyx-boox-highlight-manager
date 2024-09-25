import { useEffect, useState } from "react";
import { BiStar } from "react-icons/bi";
import { BiSolidStar } from "react-icons/bi";
import { db } from "../../db";
import HighlightCardOptions from "./HighlightCardOptions";
import { useHighlightCardEditStore } from "@/store";
import { useLiveQuery } from "dexie-react-hooks";

interface HighlightCardProps {
  id: number;
  text: string;
  bookId: number;
  starred: boolean;
  options?: string[];
}
export default function HighlightCard({
  id,
  text,
  bookId,
  starred,
  options,
}: HighlightCardProps) {
  const [isStarred, setIsStarred] = useState(starred);
  const { editingHighlightId, setEditingHighlightId } =
    useHighlightCardEditStore();
  const [editValue, setEditValue] = useState<string>(text);
  const book = useLiveQuery(() => db.books.get(bookId));
  let isEditing = editingHighlightId === id;

  useEffect(() => {
    if (isEditing) {
      setEditValue(text);
    }
  }, [editingHighlightId, text, isEditing]);

  async function handleStar() {
    setIsStarred(!isStarred);
    const highlight = await db.highlights.get(id);
    if (highlight) {
      await db.highlights.where("id").equals(id).modify({ starred: !starred });
    }
  }

  function handleEditCancel() {
    setEditingHighlightId(null);
  }

  async function handleEditConfirm() {
    const highlight = await db.highlights.get(id);
    if (!highlight) return;
    const result = await db.highlights
      .where("id")
      .equals(highlight.id)
      .modify({ quote: editValue });
    console.log(result);
    setEditingHighlightId(null);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setEditValue(event.target.value);
  }

  return (
    <div className="dark:border-stone-500 flex gap-[12px] border-solid border border-stone-400 p-4 hover-trigger">
      <div className="w-full">
        <div className="flex items-center justify-between text-neutral-400 mb-2">
          <p className="text-neutral-600 dark:text-neutral-300">
            {book?.bookTitle} - {book?.bookAuthor}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleStar}
              className="star-icon cursor-pointer"
            >
              {isStarred ? <BiSolidStar size={20} /> : <BiStar size={20} />}
            </button>
            <HighlightCardOptions
              highlightId={id}
              bookId={bookId}
              options={options}
            />
          </div>
        </div>
        {isEditing ? (
          <textarea
            className="dark:bg-neutral-900 resize-none min-h-[12rem] mb-2 w-full border border-black p-2"
            value={editValue}
            onChange={handleEditChange}
          />
        ) : (
          <p className="font-robotoSlab">{text}</p>
        )}
        {isEditing && (
          <div className="flex w-full justify-end gap-4">
            <button onClick={handleEditCancel} className="p-2 px-4 ">
              Cancel
            </button>
            <button
              onClick={handleEditConfirm}
              className="p-2 bg-neutral-800 text-white px-4 hover:bg-white hover:text-black border-2 "
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
