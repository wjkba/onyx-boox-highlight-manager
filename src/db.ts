import Dexie, { EntityTable } from "dexie";

import { type BookEntry } from "./types";

//TODO: Zmiana struktury bazy danych, dodac id klucze

const db = new Dexie("HighlightsDatabase") as Dexie & {
  highlights: EntityTable<BookEntry, "id">;
};

db.version(1).stores({
  highlights: "++id, bookTitle, bookAuthor, quotes, [bookTitle+bookAuthor]",
});

export async function clearDatabaseTable() {
  await db.highlights.clear();
}

export { db };
