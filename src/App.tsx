import { Layout } from "./components/Layout";
import HighlightsProvider from "./context/highlightsContext";
import Home from "./pages/Home";

function App() {
  return (
    <HighlightsProvider>
      <Layout>
        <Home />
      </Layout>
    </HighlightsProvider>
  );
}

export default App;
