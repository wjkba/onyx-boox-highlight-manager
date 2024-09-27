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
  // before deleting check if highlight is in any of the lists
  // if it is then remove it and update list
  const lists = await db.lists.toArray();
  for (let list of lists) {
    const index = list.highlightIds.indexOf(highlightId);
    if (index !== -1) {
      list.highlightIds.splice(index, 1);
      await db.lists.put(list);
    }
  }
  // delete highlight
  await db.highlights.where("id").equals(highlightId).delete();
}

export async function deleteHighlights(highlightIds: number[]) {
  const lists = await db.lists.toArray();
  for (let highlightId of highlightIds) {
    for (let list of lists) {
      const index = list.highlightIds.indexOf(highlightId);
      if (index !== -1) {
        list.highlightIds.splice(index, 1);
        await db.lists.put(list);
      }
    }
    // delete highlight
    await db.highlights.where("id").equals(highlightId).delete();
  }
}

export { db };
