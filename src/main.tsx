import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { StatusBar, Style } from "@capacitor/status-bar";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import "./index.css";

StatusBar.setStyle({ style: Style.Default }).catch(() => {});
StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>,
);
