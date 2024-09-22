import Dexie, { EntityTable } from "dexie";
import type { Highlight, List } from "./types/types";

const db = new Dexie("HighlightsDatabase") as Dexie & {
  highlights: EntityTable<Highlight, "id">;
  lists: EntityTable<List, "id">;
};

db.version(2).stores({
  highlights:
    "++id, bookTitle, bookAuthor, quote, starred, date, lastReviewed, lists",
  lists: "++id, name, quotes",
});

export async function clearDatabaseTable() {
  await db.highlights.clear();
}

export { db };
