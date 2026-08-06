import ImportDatabase from "../components/import-database";
import UploadBoox from "../components/upload-boox";

export default function ImportPage() {
  return (

      <div className="lg:max-w-[450px]">
        <div className="mb-8">
          <UploadBoox />
        </div>
        <ImportDatabase />
      </div>

  );
}
