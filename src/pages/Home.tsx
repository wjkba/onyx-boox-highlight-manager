import DebugMenu from "../components/DebugMenu";
import HighlightsList from "../components/HighlightsList";
import SearchBar from "../components/SearchBar";
import SidebarMenu from "../components/SidebarMenu";
import TestFormatter from "../components/TestFormatter";

export default function Home() {
  return (
    <>
      <DebugMenu />
      <TestFormatter />
      <SidebarMenu />
      <div className="mb-2">
        <SearchBar />
      </div>
      <HighlightsList />
    </>
  );
}
