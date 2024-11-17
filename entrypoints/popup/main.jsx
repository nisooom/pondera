// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./style.css";
import WritePage from "@/components/write-page.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import RecordedPage from "@/components/recorded-page.jsx";
const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/write",
    element: <WritePage />,
  },
  {
    path: "/recorded",
    element: <RecordedPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </React.StrictMode>,
);
