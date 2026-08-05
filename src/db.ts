import Dexie, { EntityTable } from "dexie";
import { Book, type Highlight, type List } from "./types/types";

const db = new Dexie("HighlightsDatabase") as Dexie & {
  highlights: EntityTable<Highlight, "id">;
  books: EntityTable<Book, "id">;
  lists: EntityTable<List, "id">;
};

db.version(3).stores({
  highlights:
    "++id, bookId, quote, starred, date, dateAdded, lastReviewed, lists",
  books: "++id, bookTitle, bookAuthor",
  lists: "++id, name, highlightIds",
});

export async function clearDatabaseTable() {
  await db.highlights.clear();
}

export async function deleteHighlight(highlightId: number) {
  await db.transaction("rw", db.lists, db.highlights, async () => {
    // before deleting check if highlight is in any of the lists
    // if it is then remove it and update list
    const lists = await db.lists.toArray();
    const deletedIds = new Set([highlightId]);
    const listsToUpdate = [];
    for (const list of lists) {
      const highlightIds = list.highlightIds.filter(
        (id) => !deletedIds.has(id),
      );
      if (highlightIds.length !== list.highlightIds.length) {
        list.highlightIds = highlightIds;
        listsToUpdate.push(list);
      }
    }
    if (listsToUpdate.length > 0) await db.lists.bulkPut(listsToUpdate);
    // delete highlight
    await db.highlights.bulkDelete([highlightId]);
  });
}

export async function deleteHighlights(highlightIds: number[]) {
  await db.transaction("rw", db.lists, db.highlights, async () => {
    const lists = await db.lists.toArray();
    const deletedIds = new Set(highlightIds);
    const listsToUpdate = [];
    for (const list of lists) {
      const remainingHighlightIds = list.highlightIds.filter(
        (id) => !deletedIds.has(id),
      );
      if (remainingHighlightIds.length !== list.highlightIds.length) {
        list.highlightIds = remainingHighlightIds;
        listsToUpdate.push(list);
      }
    }
    if (listsToUpdate.length > 0) await db.lists.bulkPut(listsToUpdate);
    // delete highlights
    await db.highlights.bulkDelete(highlightIds);
  });
}

export { db };
