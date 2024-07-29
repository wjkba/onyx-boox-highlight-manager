import Dexie, { EntityTable } from "dexie";

import { type List, type BookEntry } from "./types/types";

const db = new Dexie("HighlightsDatabase") as Dexie & {
  highlights: EntityTable<BookEntry, "id">;
  lists: EntityTable<List, "id">;
};

db.version(2).stores({
  highlights: "++id, bookTitle, bookAuthor, quotes, [bookTitle+bookAuthor]",
  lists: "++id, name, quotes",
});

export async function clearDatabaseTable() {
  await db.highlights.clear();
}

export { db };
