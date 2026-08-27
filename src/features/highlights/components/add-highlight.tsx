import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import { addBook, addHighlight, findBook } from "../api";

//TODO: ogarnij case sensitivity

export default function AddHighlight() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [successMessage, setSuccessMessage] = useState<null | string>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const highlightTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }
  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAuthor(event.target.value);
  }
  function handleHighlightTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setHighlightText(event.target.value);
    if (successMessage) setSuccessMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      title.trim() === "" ||
      author.trim() === "" ||
      highlightText.trim() === ""
    ) {
      setErrorMessage("Title, author and highlight text are required");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const dateAdded = new Date().toISOString();
      const foundBook = await findBook(title);
      let bookId: number;

      if (!foundBook) {
        const newBook = {
          bookTitle: title,
          bookAuthor: author,
        };
        bookId = await addBook(newBook);
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
      await addHighlight(newHighlight);

      setHighlightText("");
      setSuccessMessage("Saved. Drop the next quote in — book details stick.");
      highlightTextareaRef.current?.focus();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Couldn't save that one. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col dark:border-stone-500 gap-[12px] border-solid border border-stone-400 p-4 hover-trigger"
    >
      <div>
        <label
          htmlFor="add-highlight-title"
          className="block mb-2 text-neutral-600 dark:text-neutral-300"
        >
          Book title
        </label>
        <input
          id="add-highlight-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="e.g. Meditations"
          className="dark:bg-neutral-900 mb-2 w-full border border-black p-2"
        />
      </div>
      <div>
        <label
          htmlFor="add-highlight-author"
          className="block mb-2 text-neutral-600 dark:text-neutral-300"
        >
          Author
        </label>
        <input
          id="add-highlight-author"
          type="text"
          value={author}
          onChange={handleAuthorChange}
          placeholder="e.g. Marcus Aurelius"
          className="dark:bg-neutral-900 mb-2 w-full border border-black p-2"
        />
      </div>

      <div>
        <label
          htmlFor="add-highlight-quote"
          className="block mb-2 text-neutral-600 dark:text-neutral-300"
        >
          Highlight
        </label>
        <textarea
          id="add-highlight-quote"
          ref={highlightTextareaRef}
          value={highlightText}
          onChange={handleHighlightTextChange}
          className="dark:bg-neutral-900  resize-none min-h-[6rem] w-full border border-black p-2"
        />
      </div>

      <div className="min-h-[1.5rem]">
        {successMessage && (
          <p
            aria-live="polite"
            className="text-sm text-emerald-700 dark:text-emerald-400"
          >
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p
            aria-live="polite"
            className="text-sm text-red-700 dark:text-red-400"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <Button
        className="w-full lg:max-w-[276px] p-2"
        text={isSubmitting ? "Saving..." : "Add highlight"}
        type="submit"
        disabled={isSubmitting}
      />
    </form>
  );
}
