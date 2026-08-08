import { db } from "@/lib/db/client";
import Dexie from "dexie";
import * as IDBExportImport from "indexeddb-export-import";
import type { Book, Highlight, List } from "@/lib/db/types";

async function exportToJson(db: IDBDatabase): Promise<string> {
  return new Promise((resolve, reject) => {
    IDBExportImport.exportToJsonString(db, (err: Error, jsonString: string) => {
      if (err) {
        reject(err);
      } else {
        console.log("Exported as JSON: " + jsonString);
        resolve(jsonString);
      }
    });
  });
}

export async function clearDatabase(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    IDBExportImport.clearDatabase(db, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        console.log("Database cleared successfully");
        resolve();
      }
    });
  });
}

export async function importFromJson(
  db: IDBDatabase,
  jsonString: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    IDBExportImport.importFromJsonString(db, jsonString, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        console.log("Imported data successfully");
        resolve();
      }
    });
  });
}

type DatabaseSnapshot = {
  books: Book[];
  highlights: Highlight[];
  lists: List[];
};

function readSnapshot(jsonString: string): DatabaseSnapshot {
  let value: unknown;
  try {
    value = JSON.parse(jsonString);
  } catch {
    throw new Error("This file is not valid database JSON.");
  }
  if (!value || typeof value !== "object") {
    throw new Error("The database file has an invalid format.");
  }
  const snapshot = value as Record<string, unknown>;
  if (!["books", "highlights", "lists"].every((name) => Array.isArray(snapshot[name]))) {
    throw new Error("The database file is missing one or more required tables.");
  }
  const books = snapshot.books as Book[];
  const highlights = snapshot.highlights as Highlight[];
  const lists = snapshot.lists as List[];
  const ids = new Set<number>();
  if (!books.every((book) => Number.isInteger(book?.id) && typeof book.bookTitle === "string" && typeof book.bookAuthor === "string")) {
    throw new Error("The database file contains an invalid book record.");
  }
  books.forEach((book) => { ids.add(book.id); });
  if (!highlights.every((highlight) => Number.isInteger(highlight?.id) && ids.has(highlight.bookId) &&
      typeof highlight.quote === "string" && typeof highlight.date === "string" &&
      typeof highlight.dateAdded === "string" && typeof highlight.starred === "boolean")) {
    throw new Error("The database file contains an invalid highlight record.");
  }
  if (!lists.every((list) => Number.isInteger(list?.id) && typeof list.name === "string" &&
      Array.isArray(list.highlightIds) && list.highlightIds.every((id) => Number.isInteger(id)))) {
    throw new Error("The database file contains an invalid list record.");
  }
  return {
    books,
    highlights,
    lists,
  };
}

/**
 * Validates in a disposable IndexedDB first, then replaces all tables in one
 * Dexie transaction. A failed transaction rolls back, leaving the old data.
 */
export async function replaceDatabaseFromJson(jsonString: string): Promise<void> {
  const snapshot = readSnapshot(jsonString);
  const staging = new Dexie(`HighlightsDatabase-import-${crypto.randomUUID()}`);
  staging.version(3).stores({
    highlights: "++id, bookId, quote, starred, date, dateAdded, lastReviewed, lists",
    books: "++id, bookTitle, bookAuthor",
    lists: "++id, name, highlightIds",
  });

  try {
    await staging.open();
    await importFromJson(staging.backendDB(), jsonString);
    const staged = {
      books: await staging.table<Book>("books").toArray(),
      highlights: await staging.table<Highlight>("highlights").toArray(),
      lists: await staging.table<List>("lists").toArray(),
    };
    if (staged.books.length !== snapshot.books.length ||
        staged.highlights.length !== snapshot.highlights.length ||
        staged.lists.length !== snapshot.lists.length) {
      throw new Error("The database file contains records that could not be imported.");
    }
    const stagedHighlightIds = new Set(staged.highlights.map(({ id }) => id));
    if (!staged.lists.every((list) => list.highlightIds.every((id) => stagedHighlightIds.has(id)))) {
      throw new Error("The database file contains a list with a missing highlight.");
    }

    await db.transaction("rw", db.books, db.highlights, db.lists, async () => {
      await db.books.clear();
      await db.highlights.clear();
      await db.lists.clear();
      await db.books.bulkAdd(staged.books);
      await db.highlights.bulkAdd(staged.highlights);
      await db.lists.bulkAdd(staged.lists);
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error("Database replacement failed.");
  } finally {
    staging.close();
    await Dexie.delete(staging.name);
  }
}

export async function exportDbToString(): Promise<string> {
  await db.open();
  return exportToJson(db.backendDB());
}
