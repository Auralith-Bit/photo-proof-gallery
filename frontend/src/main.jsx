import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./app/router.jsx";
import QueryProvider from "./app/providers/QueryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  </StrictMode>
);