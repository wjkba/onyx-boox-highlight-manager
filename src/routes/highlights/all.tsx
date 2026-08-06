import { AllHighlightsScreen } from "@/features/highlights";
import { UploadBoox } from "@/features/import-export";

export default function AllHighlightsRoute() {
  return <AllHighlightsScreen UploadBooxComponent={UploadBoox} />;
}
