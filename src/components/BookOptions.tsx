import { BiDotsVerticalRounded, BiSolidTrash, BiEditAlt } from "react-icons/bi";

interface ListOptionsProps {
  bookId: number;
  activeOption: number | null;
  setActiveOption: (bookId: number | null) => void;
  setIsEditing: (b: boolean) => void;
  setIsDeleting: (b: boolean) => void;
}

export default function BookOptions({
  bookId,
  activeOption,
  setActiveOption,
  setIsEditing,
  setIsDeleting,
}: ListOptionsProps) {
  const isActive = activeOption === bookId;

  const cardOptions = [
    {
      text: "Edit book info",
      action: () => handleEditBookInfo(),
      icon: <BiEditAlt />,
    },

    {
      text: "Delete book",
      action: () => handleDeleteBook(),
      icon: <BiSolidTrash />,
    },
  ];

  function handleOpen() {
    if (activeOption) {
      setActiveOption(null);
    } else {
      setActiveOption(bookId);
    }
  }

  function handleEditBookInfo() {
    setIsEditing(true);
  }

  function handleDeleteBook() {
    setIsDeleting(true);
  }

  return (
    <div className={`card-options relative ${isActive && "open"}`}>
      <button type="button" aria-label={`${isActive ? "Close" : "Open"} book options`} aria-expanded={isActive} className="grid min-h-11 min-w-11 place-items-center p-2" onClick={handleOpen}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <ul className="bg-white dark:bg-neutral-900 dark:text-white pb-4 border border-black text-black p-2 absolute right-0 top-full z-10 min-w-[9rem] max-w-[calc(100vw-2rem)] w-max">
        {isActive &&
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
      </ul>
    </div>
  );
}
