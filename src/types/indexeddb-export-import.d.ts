declare module "indexeddb-export-import" {
  export function exportToJsonString(
    db: IDBDatabase,
    callback: (err: Error, jsonString: string) => void
  ): void;
  export function clearDatabase(
    db: IDBDatabase,
    callback: (err: Error) => void
  ): void;
  export function importFromJsonString(
    db: IDBDatabase,
    jsonString: string,
    callback: (err: Error) => void
  ): void;
}
