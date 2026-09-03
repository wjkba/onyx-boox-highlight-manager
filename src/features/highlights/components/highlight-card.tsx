import { useEffect, useState } from "react";
import { getHighlight, updateHighlight } from "../api";
import HighlightCardOptions, {
  type CardOptions,
} from "./highlight-card-options";
import { useHighlightCardEditStore } from "../highlight-card-store";
import { type Book } from "@/lib/db/types";
import { filledInverseClasses } from "@/components/ui/button";

interface HighlightCardProps {
  id: number;
  text: string;
  bookId: number;
  book?: Book;
  starred: boolean;
  options?: CardOptions[];
}
export default function HighlightCard({
  id,
  text,
  bookId,
  book,
  starred,
  options,
}: HighlightCardProps) {
  const { editingHighlightId, setEditingHighlightId } =
    useHighlightCardEditStore();
  const [editValue, setEditValue] = useState<string>(text);

  const isEditing = editingHighlightId === id;

  useEffect(() => {
    if (isEditing) {
      setEditValue(text);
    }
  }, [text, isEditing]);

  function handleEditCancel() {
    setEditingHighlightId(null);
  }

  async function handleEditConfirm() {
    const highlight = await getHighlight(id);
    if (!highlight) return;
    const result = await updateHighlight(highlight.id, { quote: editValue });
    console.log(result);
    setEditingHighlightId(null);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setEditValue(event.target.value);
  }

  return (
    <div className="dark:border-stone-500 flex gap-[12px] border-solid border border-stone-400 p-4 hover-trigger lg:px-5 lg:py-4">
      <div className="w-full">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 text-neutral-400 mb-2 relative">
          <p className="min-w-0 flex-1 break-words text-neutral-600 dark:text-neutral-300">
            {book?.bookTitle} - {book?.bookAuthor}
          </p>
          <div className="flex items-center gap-1 absolute right-0 top-0">
            <HighlightCardOptions
              highlightId={id}
              bookId={bookId}
              options={options}
              starred={starred}
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
          <p className="font-literata max-w-prose leading-[clamp(1.4em,_1.5em+0.5vw,_1.65em)]">
            {text}
          </p>
        )}
        {isEditing && (
          <div className="flex w-full justify-end gap-4">
            <button
              type="button"
              onClick={handleEditCancel}
              className="p-2 px-4 "
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditConfirm}
              className={`p-2 px-4 ${filledInverseClasses}`}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
