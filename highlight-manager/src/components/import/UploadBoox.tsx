import { useEffect, useState } from "react";
import { formatBoox } from "../../utils/formatBoox";
import { type Highlight } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/db";
import Button from "../Button";

export default function UploadBoox() {
  const [file, setFile] = useState<File | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const navigate = useNavigate();

  const [uploadedHighlights, setUploadedHighlights] = useState<
    Highlight[] | null
  >(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file?.type === "text/plain" && file?.size <= 5242880) {
      setIsValidFile(true);
    } else {
      setIsValidFile(false);
    }
  }, [file]);

  const handleUpload = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (file && isValidFile) {
      try {
        const result = (await formatBoox(file, setErrorMessage)) as {
          bookTitle: string;
          bookAuthor: string;
          highlights: Highlight[];
        };
        setUploadedHighlights(result.highlights);
        setBookTitle(result.bookTitle);
        setBookAuthor(result.bookAuthor);
        setIsConfirming(true);
      } catch (error) {
        setErrorMessage("Something went wrong.");
      }
    } else {
      setErrorMessage("Invalid file.");
    }
  };

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBookTitle(event.target.value);
  }
  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBookAuthor(event.target.value);
  }

  async function handleConfirm(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (uploadedHighlights) {
      updateDB(uploadedHighlights);
      setIsConfirming(false);
      setIsCompleted(true);
    }
  }

  async function updateDB(uploadedHighlights: Highlight[]) {
    let foundDuplicates = false;
    let newBookId: null | number = null;
    const foundBook = await db.books.get({ bookTitle: bookTitle });
    if (!foundBook) {
      newBookId = await db.books.add({ bookTitle, bookAuthor });
    }
    const bookId = foundBook ? foundBook.id : (newBookId as number);
    console.log("🚀 ~ updateDB ~ newBookId:", newBookId);
    console.log("🚀 ~ updateDB ~ foundBook:", foundBook);
    console.log("🚀 ~ updateDB ~ bookID:", bookId);
    for (let highlight of uploadedHighlights) {
      const highlightWithBookInfo = {
        ...highlight,
        bookId,
      };
      const foundHighlight = await db.highlights.get({
        quote: highlight.quote,
      });
      if (foundHighlight) {
        foundDuplicates = true;
        console.log("Already in database");
      } else db.highlights.add(highlightWithBookInfo);
    }
    if (foundDuplicates) setMessage("Updated highlights for existing book");
    else setMessage("Added new highlights");
  }

  if (isConfirming) {
    return (
      <form className="grid gap-2   p-2 mb-2">
        <label htmlFor="bookTitle">Book title:</label>
        <input
          onChange={handleTitleChange}
          value={bookTitle}
          id="bookTitle"
          className="py-2 px-2 w-full border text-lg border-black dark:border-white dark:bg-neutral-900"
        />
        <label htmlFor="bookAuthor">Book author:</label>
        <input
          onChange={handleAuthorChange}
          value={bookAuthor}
          id="bookTitle"
          className="py-2 px-2 w-full border text-lg border-black dark:border-white dark:bg-neutral-900"
        />
        <Button
          type="submit"
          onClick={handleConfirm}
          className="p-2 w-full"
          text="Confirm"
        />
      </form>
    );
  }

  function handleContinue() {
    setIsCompleted(false);
    navigate("/import");
  }

  function handleViewHighlights() {
    navigate("/all");
  }

  if (isCompleted) {
    return (
      <form className="grid gap-2  p-2 mb-2">
        {message && <p className="text-lg font-medium">{message}</p>}
        <p>You can continue importing or view your highlights.</p>
        <div className="flex gap-2">
          <Button
            text="Continue"
            type="button"
            onClick={handleContinue}
            className="p-2 w-full"
          />
          <Button
            text="View highlights"
            type="button"
            onClick={handleViewHighlights}
            className="p-2 w-full"
          />
        </div>
      </form>
    );
  }

  return (
    <div>
      <form className="grid gap-2  p-2 mb-8">
        <h1 className="text-xl">Import boox annotations file</h1>
        <Link
          to="/help"
          className="mb-2 text-blue-600 dark:text-blue-400 underline"
        >
          How to get onyx boox annotations file
        </Link>
        <div>
          <input className="w-full" onChange={handleChange} type="file" />
        </div>

        {errorMessage && (
          <p className="text-red-500 text mb-2">{errorMessage}</p>
        )}

        <Button
          text="Upload"
          type="button"
          onClick={handleUpload}
          className="p-2 w-full"
        />
      </form>
      <div></div>
    </div>
  );
}
