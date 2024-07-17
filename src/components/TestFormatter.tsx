import { useState } from "react";
import { formatBoox, HighlightType } from "../utils/formatBoox";
import { useHighlightsStore } from "../store";
import { db } from "../db";
import { useLiveQuery } from "dexie-react-hooks";

export default function TestFormatter() {
  const [file, setFile] = useState<File | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const dbBookEntries = useLiveQuery(() => db.highlights.toArray());
  const [upoadedBookEntry, setUpoadedBookEntry] =
    useState<HighlightType | null>(null);
  const addHighlights = useHighlightsStore((state) => state.addHighlights);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (file) {
      const result = (await formatBoox(file)) as HighlightType;
      setUpoadedBookEntry(result);
      setBookTitle(result.bookTitle);
      setBookAuthor(result.bookAuthor);
      setIsConfirming(true);
    }
  };

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBookTitle(event.target.value);
  }
  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBookAuthor(event.target.value);
  }
  function handleConfirm() {
    if (upoadedBookEntry) {
      const newHighlights = {
        quotes: upoadedBookEntry.quotes,
        bookAuthor,
        bookTitle,
      };
      addQuoteIds(newHighlights);
      addHighlights(newHighlights);
      db.highlights.add(newHighlights);
    }
  }

  function addQuoteIds(bookHighlights: HighlightType) {
    // jesli w databasie jest ksiazka o tej nazwie to
    const matchingEntry = dbBookEntries?.find((e) => e.bookTitle === bookTitle);
    if (matchingEntry) {
      const existingQuotes = matchingEntry.quotes;
      const quotesLength = matchingEntry.quotes.length;
      console.log(quotesLength);
      console.log("TITLE EXISTS");
      // TODO: jesli tytul jest w bazie danych to dodaj tylko nowe quotes
    } else {
      const newQuotes = bookHighlights.quotes.map((quote, index) => ({
        id: index + 1,
        ...quote,
      }));
      console.log(newQuotes);
    }
    // TODO: addQuoteIds zwracac obiekty, ktore zawieraja quotes z dodanymi ID
  }

  if (isConfirming) {
    return (
      <form className="grid gap-2 border border-black p-2 mb-2">
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
          className="border border-black p-1"
        />
        <button
          onClick={handleConfirm}
          className="bg-neutral-300 p-2 w-full"
          type="button"
        >
          Confirm
        </button>
      </form>
    );
  }

  return (
    <div>
      <form className="grid gap-2 border border-black p-2 mb-2">
        <div>
          <input onChange={handleChange} type="file" />
        </div>
        <button
          onClick={handleUpload}
          className="bg-neutral-300 p-2 w-full"
          type="button"
        >
          Upload
        </button>
      </form>
      <div></div>
    </div>
  );
}
