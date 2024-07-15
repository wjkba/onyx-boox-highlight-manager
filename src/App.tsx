import HighlightCard from "./components/HighlightCard";
import { Layout } from "./components/Layout";
import SearchBar from "./components/SearchBar";
import SidebarMenu from "./components/SidebarMenu";

function App() {
  return (
    <Layout>
      <SidebarMenu />
      <div className="mb-2">
        <SearchBar />
      </div>
      <div className="grid gap-2">
        <HighlightCard />
        <HighlightCard />
      </div>
    </Layout>
  );
}

export default App;
