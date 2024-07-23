import ImportDatabase from "@/components/import/ImportDatabase";
import TestFormatter from "../components/import/TestFormatter";
import { Layout } from "../Layout";

export default function ImportPage() {
  return (
    <Layout>
      <TestFormatter />
      <ImportDatabase />
    </Layout>
  );
}
