import { ReactNode, useState } from "react";
import SidebarMenu from "../components/SidebarMenu";
import AllHighlightsPage from "./AllHighlightsPage";

export default function Home() {
  const [activePage, setActivePage] = useState<ReactNode>(
    <AllHighlightsPage />
  );

  return (
    <>
      {/* <TestFormatter /> */}
      <SidebarMenu setActivePage={setActivePage} />
      {activePage}
    </>
  );
}
