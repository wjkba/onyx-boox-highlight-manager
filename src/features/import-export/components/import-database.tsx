import { replaceDatabaseFromJson } from "@/lib/storage/export-db";
import React, { useState } from "react";
import Button from "@/components/ui/button";

export default function ImportDatabase() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<null | File>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files) {
      setFile(event.target.files[0]);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!file) {
      setErrorMessage("Choose a database export file first.");
      return;
    }
    setIsBusy(true);
    try {
      const json = await file.text();
      await replaceDatabaseFromJson(json);
      setSuccessMessage("Database replaced successfully. Your imported highlights are ready.");
    } catch (error) {
      setErrorMessage(error instanceof Error
        ? `${error.message} Your existing data was not replaced.`
        : "Database import failed. Your existing data was not replaced.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="grid gap-2 mb-2">
      <h1 className="text-xl">Import highlights database</h1>
      <p className="mb-2">
        This replaces all local books, highlights, and lists. Export a backup first
        if you may need to recover the current data.
      </p>
      <p className="border border-amber-600 p-2 mb-2" role="alert">
        Warning: importing replaces the current database and cannot be undone here.
      </p>
      <label htmlFor="database-file">Highlights database file:</label>
      <input
        id="database-file"
        className="w-full"
        onChange={handleChange}
        type="file"
      />

      {errorMessage && <p className="text-red-500 text mb-2">{errorMessage}</p>}
      {successMessage && <output className="text-green-600 mb-2">{successMessage}</output>}
      {isBusy && <output className="block">Validating and replacing database…</output>}
      <Button text={isBusy ? "Importing…" : "Replace database"} type="submit" disabled={isBusy} className="p-2 w-full" />
    </form>
  );
}
