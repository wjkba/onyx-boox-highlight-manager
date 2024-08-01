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
    <div className={`card-options ${isActive && "open"}`}>
      <button className="grid place-items-center p-4" onClick={handleOpen}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <ul className="bg-white dark:bg-neutral-900 dark:text-white pb-4 border border-black text-black p-2 absolute max-w-[9rem] w-full  -translate-x-[6.4rem]">
        {isActive &&
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
      </ul>
    </div>
  );
}
