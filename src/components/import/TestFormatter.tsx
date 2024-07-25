import { useEffect, useState } from "react";
import { formatBoox } from "../../utils/formatBoox";
import { type HighlightType } from "../../types";
import { db } from "../../db";
import { useLiveQuery } from "dexie-react-hooks";
import { Link, useNavigate } from "react-router-dom";

export default function TestFormatter() {
  const [file, setFile] = useState<File | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const dbBookEntries = useLiveQuery(() => db.highlights.toArray());
  const navigate = useNavigate();

  const [uploadedBookEntry, setUploadedBookEntry] =
    useState<HighlightType | null>(null);

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
        const result = (await formatBoox(
          file,
          setErrorMessage
        )) as HighlightType;
        setUploadedBookEntry(result);
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
    if (uploadedBookEntry) {
      let newHighlights = {
        quotes: uploadedBookEntry.quotes,
        bookAuthor: bookAuthor.trim(),
        bookTitle: bookTitle.trim(),
      };
      newHighlights.quotes = getQuotesWithIds(newHighlights);
      await updateDB(newHighlights);
      setIsConfirming(false);
      setIsCompleted(true);
    }
  }

  function getQuotesWithIds(bookHighlights: HighlightType) {
    // TODO: DO ZMIANY, OPTYMALIZACJA LEZY
    // uzyj map albo set
    const matchingEntry = dbBookEntries?.find(
      (e) => e.bookTitle === bookTitle && e.bookAuthor === bookAuthor
    );
    if (matchingEntry) {
      const existingQuotes = matchingEntry.quotes;
      const incomingQuotes = bookHighlights.quotes;
      const newQuotes = incomingQuotes.filter(
        (incomingQuote) =>
          !existingQuotes.some(
            (existingQuote) => existingQuote.text === incomingQuote.text
          )
      );
      const quotesLength = matchingEntry.quotes.length;
      const newQuotesWithIds = newQuotes.map((quote, index) => ({
        id: quotesLength + index + 1,
        ...quote,
      }));
      return newQuotesWithIds;
    } else {
      const newQuotesWithIds = bookHighlights.quotes.map((quote, index) => ({
        id: index + 1,
        ...quote,
      }));
      return newQuotesWithIds;
    }
  }

  async function updateDB(newHighlights: HighlightType) {
    const book = await db.highlights.where({ bookTitle, bookAuthor }).first();
    if (book) {
      const updatedBook = {
        ...book,
        quotes: [...book.quotes, ...newHighlights.quotes],
      };
      await db.highlights.put(updatedBook);
      setMessage("Updated highlights for existing book");
    } else {
      await db.highlights.add(newHighlights);
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
          className="border border-black p-1"
        />
        <label htmlFor="bookAuthor">Book author:</label>
        <input
          onChange={handleAuthorChange}
          value={bookAuthor}
          id="bookTitle"
          className="border border-black p-1 mb-2"
        />
        <button
          onClick={handleConfirm}
          className="p-2 w-full bg-neutral-300 hover:bg-neutral-700 hover:text-white"
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
            className="p-2 w-full bg-neutral-300 hover:bg-neutral-700 hover:text-white"
            type="button"
            onClick={handleContinue}
          >
            Continue
          </button>
          <button
            className="p-2 w-full bg-neutral-300 hover:bg-neutral-700 hover:text-white"
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
        <h1 className="text-xl mb-2">Import boox annotations file</h1>
        <Link to="/help" className="text-blue-700 underline">
          How to get onyx boox annotations file
        </Link>
        <div>
          <input onChange={handleChange} type="file" />
        </div>

        {errorMessage && (
          <p className="text-red-500 text mb-2">{errorMessage}</p>
        )}

        <button
          onClick={handleUpload}
          className="bg-neutral-300 hover:bg-neutral-700 mt-2 hover:text-white p-2 w-full"
          type="submit"
        >
          Upload
        </button>
      </form>
      <div></div>
    </div>
  );
}
