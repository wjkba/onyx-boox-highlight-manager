import { useEffect, useState } from "react";
import { formatBoox } from "../../utils/formatBoox";
import { type Highlight } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/db";

export default function TestFormatter() {
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
      // confirm logic
      // upload highlights to db
      const highlightWithBookInfo = {
        ...uploadedHighlights[0],
        bookAuthor,
        bookTitle,
      };
      db.highlights.add(highlightWithBookInfo);
      setIsConfirming(false);
      setIsCompleted(true);
    }
  }

  async function updateDB(newHighlights: HighlightType) {
    // const book = await db.highlights.where({ bookTitle, bookAuthor }).first();
    if (uploadedHighlights) {
      // if there is already a book check for duplicates
      // check for duplicates
      //
      setMessage("Updated highlights for existing book");
    } else {
      // else add all highlights
      setMessage("Added new highlights");
    }
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
        <button
          onClick={handleConfirm}
          className="p-2 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          type="submit"
        >
          Confirm
        </button>
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
          <button
            className="p-2 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            type="button"
            onClick={handleContinue}
          >
            Continue
          </button>
          <button
            className="p-2 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            type="button"
            onClick={handleViewHighlights}
          >
            View highlights
          </button>
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

        <button
          onClick={handleUpload}
          className="p-2 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          type="submit"
        >
          Upload
        </button>
      </form>
      <div></div>
    </div>
  );
}
