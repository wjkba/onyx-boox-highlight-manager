import { useState } from "react";
import { formatBoox, HighlightType } from "../utils/formatBoox";
import { useHighlights } from "../context/highlightsContext";

export default function TestFormatter() {
  const [file, setFile] = useState<File | null>(null);
  const { highlights, setHighlights } = useHighlights();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (file) {
      const result = (await formatBoox(file)) as HighlightType;
      setHighlights([...highlights, result]);
    }
  };

  return (
    <div>
      <form className="grid gap-2 border border-black p-2 mb-2">
        <div>
          <input onChange={handleChange} type="file" />
        </div>
        <button
          onClick={handleUpload}
          className="bg-neutral-300 p-2 w-full"
          type="submit"
        >
          Upload
        </button>
      </form>
      <div></div>
    </div>
  );
}
