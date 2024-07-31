import ImportDatabase from "@/components/import/ImportDatabase";
import TestFormatter from "../components/import/TestFormatter";
import { Layout } from "../Layout";

export default function ImportPage() {
  return (
    <Layout>
      <div className="lg:max-w-[450px]">
        <div className="mb-4">
          <TestFormatter />
        </div>
        <ImportDatabase />
      </div>
    </Layout>
  );
}
