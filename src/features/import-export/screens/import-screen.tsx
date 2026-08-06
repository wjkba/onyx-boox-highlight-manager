import { useState } from "react";

import ImportDatabase from "../components/import-database";
import UploadBoox from "../components/upload-boox";
import UploadKoreader from "../components/upload-koreader";

type ImportSource = "boox" | "koreader";

export default function ImportPage() {
  const [source, setSource] = useState<ImportSource>("boox");

  return (
    <>
      <form className="grid gap-2 lg:max-w-[450px] mb-8">
        <label htmlFor="import-source">Import source</label>
        <select
          className="p-2 w-full dark:bg-neutral-900"
          name="import-source"
          id="import-source"
          value={source}
          onChange={(event) => setSource(event.target.value as ImportSource)}
        >
          <option value="boox">Onyx Boox annotations (TXT)</option>
          <option value="koreader">KOReader highlights (JSON)</option>
        </select>
      </form>

      <div className="lg:max-w-[450px] mb-8">
        {source === "boox" ? <UploadBoox /> : <UploadKoreader />}
      </div>

      <div className="lg:max-w-[450px]">
        <ImportDatabase />
      </div>
    </>
  );
}
