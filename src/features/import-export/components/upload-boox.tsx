import { useState } from "react";
import { type NewHighlight } from "@/lib/db/types";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import { importHighlights } from "../api";
import { parseBooxFile } from "../sources";

const MAX_FILE_SIZE = 5242880;

export default function UploadBoox() {
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<NewHighlight[] | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  async function upload(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault(); setError(null);
    if (!file || file.size > MAX_FILE_SIZE || (file.type && file.type !== "text/plain")) {
      setError("Select a plain-text Boox annotations file no larger than 5 MB."); return;
    }
    setBusy(true);
    try {
      const result = await parseBooxFile(file);
      if (!result.highlights.length) throw new Error("No highlights found. Check that this is a Boox annotations TXT export.");
      setParsed(result.highlights); setTitle(result.bookTitle); setAuthor(result.bookAuthor); setConfirming(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not parse the Boox file. Check its format and try again.");
    } finally { setBusy(false); }
  }

  async function confirm(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault(); setError(null);
    if (!parsed || !title.trim()) { setError("Enter a book title before confirming."); return; }
    setBusy(true);
    try {
      const duplicate = await importHighlights(title, author, parsed);
      setMessage(duplicate ? "Updated highlights for existing book." : "Added new highlights.");
      setConfirming(false); setCompleted(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save these highlights. Try again.");
    } finally { setBusy(false); }
  }

  if (confirming) return <form className="grid gap-2 p-2 mb-2">
    <h1 className="text-xl">Confirm Boox import</h1>
    <p>Detected {parsed?.length ?? 0} highlights.</p>
    <label htmlFor="boox-title">Book title:</label>
    <input id="boox-title" value={title} onChange={(e) => setTitle(e.target.value)} className="py-2 px-2 w-full border dark:bg-neutral-900" />
    <label htmlFor="boox-author">Book author:</label>
    <input id="boox-author" value={author} onChange={(e) => setAuthor(e.target.value)} className="py-2 px-2 w-full border dark:bg-neutral-900" />
    {error && <p className="text-red-500">{error}</p>}
    <Button type="submit" onClick={confirm} disabled={busy} className="p-2 w-full" text={busy ? "Saving…" : "Confirm"} />
  </form>;

  if (completed) return <div className="grid gap-2 p-2 mb-2">
    <p className="text-lg font-medium">{message}</p><p>You can continue importing or view your highlights.</p>
    <div className="flex gap-2"><Button text="Continue" type="button" onClick={() => { setCompleted(false); setFile(null); }} className="p-2 w-full" /><Button text="View highlights" type="button" onClick={() => navigate("/all")} className="p-2 w-full" /></div>
  </div>;

  return <form className="grid gap-2">
    <h1 className="text-xl">Import Boox annotations file</h1>
    <Link to="/help" className="mb-2 text-blue-600 dark:text-blue-400 underline">How to get Onyx Boox annotations file</Link>
    <label htmlFor="boox-file">Boox annotations TXT file:</label>
    <input id="boox-file" className="w-full" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(null); }} type="file" accept=".txt,text/plain" />
    {error && <p className="text-red-500">{error}</p>}
    <Button text={busy ? "Parsing…" : "Upload"} type="button" onClick={upload} disabled={busy} className="p-2 w-full" />
  </form>;
}
