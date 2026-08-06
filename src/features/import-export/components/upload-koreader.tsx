import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import type { NewHighlight } from "@/lib/db/types";
import { importHighlights } from "../api";
import { parseKoreaderFile } from "../sources";

const MAX_FILE_SIZE = 5242880;

export default function UploadKoreader() {
  const [file, setFile] = useState<File | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [uploadedHighlights, setUploadedHighlights] = useState<NewHighlight[] | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setErrorMessage(null);
  };

  const isValidFile = file !== null && file.size <= MAX_FILE_SIZE &&
    (!file.type || file.type === "application/json" || file.name.toLowerCase().endsWith(".json"));

  const handleUpload = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!file || !isValidFile) {
      setErrorMessage("Invalid file. Select a JSON file no larger than 5 MB.");
      return;
    }

    try {
      const result = await parseKoreaderFile(file);
      setUploadedHighlights(result.highlights);
      setBookTitle(result.bookTitle);
      setBookAuthor(result.bookAuthor);
      setIsConfirming(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  const handleConfirm = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!uploadedHighlights) return;

    try {
      const duplicate = await importHighlights(bookTitle, bookAuthor, uploadedHighlights);
      setMessage(duplicate ? "Updated highlights for existing book" : "Added new highlights");
      setIsConfirming(false);
      setIsCompleted(true);
    } catch {
      setErrorMessage("Something went wrong.");
    }
  };

  if (isConfirming) {
    return (
      <form className="grid gap-2 p-2 mb-2">
        <h1 className="text-xl">Confirm KOReader import</h1>
        <p className="mb-1">Detected {uploadedHighlights?.length ?? 0} highlights.</p>
        <label htmlFor="koreader-book-title">Book title:</label>
        <input
          id="koreader-book-title"
          value={bookTitle}
          onChange={(event) => setBookTitle(event.target.value)}
          className="py-2 px-2 w-full border text-lg border-black dark:border-white dark:bg-neutral-900"
        />
        <label htmlFor="koreader-book-author">Book author:</label>
        <input
          id="koreader-book-author"
          value={bookAuthor}
          onChange={(event) => setBookAuthor(event.target.value)}
          className="py-2 px-2 w-full border text-lg border-black dark:border-white dark:bg-neutral-900"
        />
        {errorMessage && <p className="text-red-500 text mb-2">{errorMessage}</p>}
        <Button type="submit" onClick={handleConfirm} className="p-2 w-full" text="Confirm" />
      </form>
    );
  }

  if (isCompleted) {
    return (
      <form className="grid gap-2 p-2 mb-2">
        {message && <p className="text-lg font-medium">{message}</p>}
        <p>You can continue importing or view your highlights.</p>
        <div className="flex gap-2">
          <Button
            text="Continue"
            type="button"
            onClick={() => {
              setIsCompleted(false);
              setFile(null);
            }}
            className="p-2 w-full"
          />
          <Button
            text="View highlights"
            type="button"
            onClick={() => navigate("/all")}
            className="p-2 w-full"
          />
        </div>
      </form>
    );
  }

  return (
    <form className="grid gap-2">
      <h1 className="text-xl">Import KOReader highlights file</h1>
      <p className="mb-1">Select the JSON file exported by KOReader.</p>
      <label htmlFor="koreader-file">KOReader JSON file:</label>
      <input
        id="koreader-file"
        className="w-full"
        onChange={handleChange}
        type="file"
        accept=".json,application/json"
      />

      {errorMessage && <p className="text-red-500 text mb-2">{errorMessage}</p>}

      <Button
        text="Upload"
        type="button"
        onClick={handleUpload}
        className="p-2 w-full"
      />
    </form>
  );
}
