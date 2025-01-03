import { useState } from "react";
import Button from "./Button";
import { db } from "@/db";

export default function AddHighlight() {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [successMessage, setSuccessMessage] = useState<null | string>(null);

  //TODO: ogarnij case sensitivity

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setTitle(event.target.value);
  }
  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setAuthor(event.target.value);
  }
  function handleHighlightTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    event.preventDefault();
    setHighlightText(event.target.value);
  }

  function handleOpen() {
    setSuccessMessage(null);
    setIsOpened(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      title.trim() === "" ||
      author.trim() === "" ||
      highlightText.trim() === ""
    ) {
      setErrorMessage("Invalid input");
      return;
    }
    setErrorMessage(null);
    const dateAdded = new Date().toISOString();
    let foundBook = await db.books.get({ bookTitle: title });
    let bookId: number;

    if (!foundBook) {
      const newBook = {
        bookTitle: title,
        bookAuthor: author,
      };
      bookId = await db.books.add(newBook);
    } else {
      bookId = foundBook.id;
    }

    const newHighlight = {
      bookId,
      date: dateAdded,
      dateAdded,
      quote: highlightText,
      starred: false,
      lastReviewed: null,
    };
    await db.highlights.add(newHighlight);

    setSuccessMessage("Highlight added successfully");
    setIsOpened(false);
  }

  if (!isOpened) {
    return (
      <div>
        {successMessage && <p className="mb-4">{successMessage}</p>}
        <Button
          className="w-full lg:max-w-[276px] p-2"
          text="Add new highlight"
          onClick={handleOpen}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col dark:border-stone-500 gap-[12px] border-solid border border-stone-400 p-4 hover-trigger"
    >
      <div>
        <label className="block mb-2 text-neutral-600 dark:text-neutral-300">
          Book title
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="dark:bg-neutral-900 mb-2 w-full border border-black p-2"
        />
      </div>
      <div>
        <label className="block mb-2 text-neutral-600 dark:text-neutral-300">
          Author
        </label>
        <input
          type="text"
          value={author}
          onChange={handleAuthorChange}
          className="dark:bg-neutral-900 mb-2 w-full border border-black p-2"
        />
      </div>

      <div>
        <label className="block mb-2 text-neutral-600 dark:text-neutral-300">
          Highlight
        </label>
        <textarea
          value={highlightText}
          onChange={handleHighlightTextChange}
          className="dark:bg-neutral-900  resize-none min-h-[6rem] w-full border border-black p-2"
          // value={editValue}
          // onChange={handleEditChange}
        />
      </div>

      <div className="mb-6">{errorMessage && <p>{errorMessage}</p>}</div>

      <Button
        className="w-full lg:max-w-[276px] p-2"
        text="Add new highlight"
        type="submit"
      />
      <Button
        className="w-full lg:max-w-[276px] p-2"
        text="Cancel"
        type="button"
        onClick={() => setIsOpened(false)}
      />
    </form>
  );
}
