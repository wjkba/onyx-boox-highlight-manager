import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.tsx";
import AllHighlightsPage from "./pages/AllHighlightsPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import StarredPage from "./pages/StarredPage.tsx";
import ImportPage from "./pages/ImportPage.tsx";
import ExportPage from "./pages/ExportPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import BookPage from "./pages/BookPage.tsx";
import DailyReviewPage from "./pages/DailyReviewPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import HelpPage from "./pages/HelpPage.tsx";
import ListsPage from "./pages/ListsPage.tsx";
import ListPage from "./pages/ListPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/all",
    element: <AllHighlightsPage />,
  },
  {
    path: "/books",
    element: <BooksPage />,
  },
  {
    path: "/books/:bookId",
    element: <BookPage />,
  },
  {
    path: "/lists",
    element: <ListsPage />,
  },
  {
    path: "/lists/:listId",
    element: <ListPage />,
  },
  {
    path: "/starred",
    element: <StarredPage />,
  },
  {
    path: "/import",
    element: <ImportPage />,
  },
  {
    path: "/export",
    element: <ExportPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/review",
    element: <DailyReviewPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/help",
    element: <HelpPage />,
  },
]);

function Main() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
