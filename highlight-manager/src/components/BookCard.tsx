import { db } from "@/db";
import { useState } from "react";
import { Link } from "react-router-dom";
import BookOptions from "./BookOptions";
import Button from "./Button";

interface BookCardProps {
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  activeOption: number | null;
  setActiveOption: (bookId: number | null) => void;
}

export default function BookCard({
  bookId,
  bookTitle,
  bookAuthor,
  activeOption,
  setActiveOption,
}: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState(bookTitle);
  const [newBookAuthor, setNewBookAuthor] = useState(bookAuthor);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewBookTitle(event.target.value);
  }
  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewBookAuthor(event.target.value);
  }
  async function handleEditConfirm(event: React.FormEvent) {
    event.preventDefault();
    if (newBookTitle.length > 0 && newBookAuthor.length > 0) {
      const result = await db.books.update(bookId, {
        bookTitle: newBookTitle,
        bookAuthor: newBookAuthor,
      });
      console.log(result);
    }
    setIsEditing(false);
    setActiveOption(null);
  }

  async function handleDeleteConfirm(event: React.FormEvent) {
    event.preventDefault();
    await db.highlights.where("bookId").equals(bookId).delete();
    await db.books.where("id").equals(bookId).delete();
    handleCancel();
  }

  function handleCancel() {
    setActiveOption(null);
    setIsEditing(false);
    setIsDeleting(false);
    setNewBookTitle(bookTitle);
    setNewBookAuthor(bookAuthor);
  }

  if (isEditing) {
    return (
      <div className=" border dark:border-white border-black lg:max-w-[276px] w-full dark:hover:bg-neutral-900  hover:bg-neutral-50">
        <form onSubmit={handleEditConfirm} className="p-4">
          <div className="mb-2">
            <label htmlFor="bookTitle">Title:</label>
            <input
              id="bookTitle"
              value={newBookTitle}
              onChange={handleTitleChange}
              className="w-full mb-2 lg:m-0 p-1 border text-lg border-black dark:border-white dark:bg-neutral-900"
            ></input>
          </div>
          <div className="mb-4">
            <label htmlFor="bookAuthor">Author:</label>
            <input
              id="bookAuthor"
              value={newBookAuthor}
              onChange={handleAuthorChange}
              className=" w-full mb-2 lg:m-0 p-1 border text-lg border-black dark:border-white dark:bg-neutral-900"
            ></input>
          </div>
          <div className="flex">
            <Button
              onClick={handleCancel}
              className="p-2 w-full"
              text="Cancel"
            />
            <Button type="submit" className="p-2 w-full" text="Confirm" />
          </div>
        </form>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="p-4 border dark:border-white border-black lg:max-w-[276px] w-full dark:hover:bg-neutral-900  hover:bg-neutral-50">
        <p className="mb-2">
          You are about to delete {bookTitle} by {bookAuthor}
        </p>
        <form onSubmit={handleDeleteConfirm}>
          <div className="flex">
            <Button
              onClick={handleCancel}
              className="p-2 w-full"
              text="Cancel"
            />
            <Button type="submit" className="p-2 w-full" text="Confirm" />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex justify-between border dark:border-stone-500 border-stone-400 lg:max-w-[276px] w-full dark:hover:bg-neutral-900  hover:bg-stone-100">
      <Link className="p-4 w-full" to={`/books/${bookId}`} key={bookId}>
        <p className="text-lg">{bookTitle}</p>
        <p className=" text-stone-600 dark:text-neutral-400">{bookAuthor}</p>
      </Link>
      <div className="flex items-star">
        <BookOptions
          setIsEditing={setIsEditing}
          setIsDeleting={setIsDeleting}
          bookId={bookId}
          activeOption={activeOption}
          setActiveOption={setActiveOption}
        />
      </div>
    </div>
  );
}
