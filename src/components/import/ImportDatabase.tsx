import { db } from "@/db";
import { clearDatabase, importFromJson } from "@/utils/exportDb";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

export default function ImportDatabase() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<null | File>(null);
  const navigate = useNavigate();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files) {
      console.log(event.target.files[0]);
      setFile(event.target.files[0]);
    }
  }

  function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    readImportedFile(file);
  }

  function readImportedFile(file: File | null) {
    if (file) {
      const reader = new FileReader();
      let jsonDbString = "";

      reader.onload = async function (event) {
        if (typeof event.target?.result === "string") {
          jsonDbString = event.target?.result;
          await clearDatabase(db.backendDB());
          await importFromJson(db.backendDB(), jsonDbString);
          navigate("/all");
          window.location.reload();
        }
      };

      reader.onerror = function (error) {
        console.error("Error reading file:", error);
        setErrorMessage("Error reading file:");
      };

      reader.readAsText(file);
    }
  }

  return (
    <form onSubmit={handleUpload} className="grid gap-2 mb-2">
      <h1 className="text-xl">Import highlights database</h1>
      <p className="mb-2">
        Import your highlights easily from a saved file. Click the button below
        to load your data into the app.
      </p>
      <div className="mb-0">
        <input className="w-full" onChange={handleChange} type="file" />
      </div>

      {errorMessage && <p className="text-red-500 text mb-2">{errorMessage}</p>}
      <Button text="Upload" type="submit" className="p-2 w-full" />
    </form>
  );
}
