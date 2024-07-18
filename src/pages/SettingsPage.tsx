import { clearDatabaseTable } from "../db";
import { Layout } from "../Layout";

export default function SettingsPage() {
  function handleDatabaseDelete() {
    clearDatabaseTable();
  }

  return (
    <Layout>
      <h1 className="text-lg mb-2">SettingsPage</h1>
      <div>
        <button
          onClick={handleDatabaseDelete}
          className="bg-red-600 text-white hover:bg-black p-2 border"
        >
          CLEAR DATABASE TABLE
        </button>
      </div>
    </Layout>
  );
}
