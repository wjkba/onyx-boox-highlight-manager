import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/app/layout";

const Home = lazy(() => import("@/routes/highlights/home"));
const AllHighlightsPage = lazy(() => import("@/routes/highlights/all"));
const BooksPage = lazy(() => import("@/routes/books"));
const StarredPage = lazy(() => import("@/routes/highlights/starred"));
const ImportPage = lazy(() => import("@/routes/import-export/import"));
const ExportPage = lazy(() => import("@/routes/import-export/export"));
const SettingsPage = lazy(() => import("@/routes/settings"));
const BookPage = lazy(() => import("@/routes/books/detail"));
const DailyReviewPage = lazy(() => import("@/routes/daily-review"));
const AboutPage = lazy(() => import("@/routes/info/about"));
const HelpPage = lazy(() => import("@/routes/info/help"));
const ListsPage = lazy(() => import("@/routes/lists"));
const ListPage = lazy(() => import("@/routes/lists/detail"));
const HighlightPage = lazy(() => import("@/routes/highlights/detail"));

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  { path: "/", element: <Navigate to="/home" /> },
  {
    element: <Layout />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/all", element: <AllHighlightsPage /> },
      { path: "/books", element: <BooksPage /> },
      { path: "/books/:bookId", element: <BookPage /> },
      { path: "/highlight/:highlightId", element: <HighlightPage /> },
      { path: "/lists", element: <ListsPage /> },
      { path: "/lists/:listId", element: <ListPage /> },
      { path: "/starred", element: <StarredPage /> },
      { path: "/import", element: <ImportPage /> },
      { path: "/export", element: <ExportPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/help", element: <HelpPage /> },
      { path: "/review", element: <DailyReviewPage /> },
    ],
  },
]);
