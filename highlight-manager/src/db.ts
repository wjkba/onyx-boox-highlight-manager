import Dexie, { EntityTable } from "dexie";
import { Book, type Highlight, type List } from "./types/types";

const db = new Dexie("HighlightsDatabase") as Dexie & {
  highlights: EntityTable<Highlight, "id">;
  books: EntityTable<Book, "id">;
  lists: EntityTable<List, "id">;
};

db.version(3).stores({
  highlights: "++id, bookId, quote, starred, date, lastReviewed, lists",
  books: "++id, bookTitle, bookAuthor",
  lists: "++id, name, highlightIds",
});

export async function clearDatabaseTable() {
  await db.highlights.clear();
}

export { db };
