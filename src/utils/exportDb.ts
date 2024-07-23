import { db } from "@/db";
import * as IDBExportImport from "indexeddb-export-import";

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

export async function exportDbToString() {
  try {
    await db.open();
    const idbDatabase = db.backendDB();
    const jsonString = await exportToJson(idbDatabase);
    return jsonString;
  } catch (e) {
    console.error("Operation failed: " + e);
  }
}
