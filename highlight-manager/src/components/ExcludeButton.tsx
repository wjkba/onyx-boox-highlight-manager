import { useEffect, useState } from "react";

interface ExcludeButtonProps {
  text: string;
  bookId: number;
}

export default function ExcludeButton({ text, bookId }: ExcludeButtonProps) {
  const [isExcluded, setIsExcluded] = useState(false);

  useEffect(() => {
    const localExcludedBooks = localStorage.getItem("excludedBooks");
    if (localExcludedBooks) {
      let excludedBooks: number[] = JSON.parse(localExcludedBooks);
      const isBookExcluded =
        excludedBooks.find((excluded) => excluded === bookId) !== undefined;
      setIsExcluded(isBookExcluded);
    }
  }, []);

  function handleExcludeBook() {
    setIsExcluded(!isExcluded);
    const localExcludedBooks = localStorage.getItem("excludedBooks");
    let excludedBooks: number[] = [];
    if (localExcludedBooks) {
      excludedBooks = JSON.parse(localExcludedBooks);
      if (excludedBooks.includes(bookId)) {
        excludedBooks = excludedBooks.filter(
          (excluded: number) => excluded !== bookId
        );
      } else excludedBooks.push(bookId);
    } else excludedBooks = [bookId];

    localStorage.setItem("excludedBooks", JSON.stringify(excludedBooks));
    console.log(excludedBooks);
  }

  return (
    <button
      onClick={handleExcludeBook}
      className={`${isExcluded && "line-through "} py-1 text-left w-full`}
    >
      - {text}
    </button>
  );
}
