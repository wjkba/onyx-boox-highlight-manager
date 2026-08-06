import { useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { BiSortUp } from "react-icons/bi";
import { BiSortDown } from "react-icons/bi";

interface SortOptionsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  sortOrder: "desc" | "asc";
  setSortOrder: (option: "desc" | "asc") => void;
}

export default function SortOptions({
  sortOption,
  setSortOption,
  sortOrder,
  setSortOrder,
}: SortOptionsProps) {
  const [isSortHidden, setIsSortHidden] = useState(true);

  function handleSortVisibility() {
    setIsSortHidden(!isSortHidden);
  }

  function handleSortChange(option: string) {
    setSortOption(option);
  }

  function handleSortOrderChange() {
    if (sortOrder === "desc") setSortOrder("asc");
    if (sortOrder === "asc") setSortOrder("desc");
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={handleSortOrderChange}
          className="text-neutral-600 dark:text-neutral-300 "
        >
          {sortOrder === "desc" ? (
            <BiSortDown size={24} />
          ) : (
            <BiSortUp size={24} />
          )}
        </button>
        <button
          type="button"
          onClick={handleSortVisibility}
          className="p-2 flex gap-1 text-neutral-600 dark:text-neutral-300 "
        >
          <BiSortAlt2 size={24} />
          <label className="cursor-pointer">Sort by</label>
        </button>
      </div>

      <div
        className={`${
          isSortHidden && `hidden lg:hidden `
        }} lg:flex lg:justify-end grid gap-1`}
      >
        <button
          onClick={() => handleSortChange("alphabet")}
          className={`${
            sortOption === "alphabet"
              ? "bg-neutral-800 dark:bg-white text-white dark:text-black "
              : " "
          } lg:px-2 lg:py-1 p-2 active:bg-neutral-800 dark:active:bg-white hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black`}
        >
          Alphabetical
        </button>
        <button
          onClick={() => handleSortChange("dateAdded")}
          className={`${
            sortOption === "dateAdded"
              ? "bg-neutral-800 dark:bg-white text-white dark:text-black "
              : " "
          } lg:px-2 lg:py-1 p-2 active:bg-neutral-800 dark:active:bg-white hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black`}
        >
          Date Added
        </button>
        <button
          onClick={() => handleSortChange("dateHighlighted")}
          className={`${
            sortOption === "dateHighlighted"
              ? "bg-neutral-800 dark:bg-white text-white dark:text-black "
              : " "
          } lg:px-2 lg:py-1 p-2 active:bg-neutral-800 dark:active:bg-white hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black`}
        >
          Date Highlighted
        </button>
      </div>
    </div>
  );
}
