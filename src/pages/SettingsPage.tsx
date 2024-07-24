import DangerButton from "@/components/DangerButton";
import { clearDatabaseTable } from "../db";
import { Layout } from "../Layout";

export default function SettingsPage() {
  function handleDatabaseDelete() {
    clearDatabaseTable();
  }
  // ADD DAILY REVIEW SETTINGS
  return (
    <Layout>
      <h1 className="text-xl mb-4">Settings</h1>
      <div className="mb-6">
        <h2>Review settings</h2>
        <select name="" id="">
          <option value="x">WIP</option>
        </select>
      </div>
      <div>
        <h2>Danger zone</h2>
        <div>
          <DangerButton action={handleDatabaseDelete} />
        </div>
      </div>
    </Layout>
  );
}
