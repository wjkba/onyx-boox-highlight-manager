import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
