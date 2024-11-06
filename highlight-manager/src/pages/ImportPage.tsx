import ImportDatabase from "@/components/import/ImportDatabase";
import UploadBoox from "../components/import/UploadBoox";
import { Layout } from "../Layout";

export default function ImportPage() {
  return (
    <Layout>
      <div className="lg:max-w-[450px]">
        <div className="mb-8">
          <UploadBoox />
        </div>
        <ImportDatabase />
      </div>
    </Layout>
  );
}
