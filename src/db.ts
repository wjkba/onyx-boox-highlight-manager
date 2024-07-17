import Dexie, { EntityTable } from "dexie";

import { HighlightType } from "./utils/formatBoox";

const db = new Dexie("HighlightsDatabase") as Dexie & {
  highlights: EntityTable<HighlightType>;
};

db.version(1).stores({
  highlights: "bookTitle, bookAuthor, quotes",
});

export { db };
