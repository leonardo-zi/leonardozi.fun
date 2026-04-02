import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// 刷新页面时不希望浏览器恢复到上次滚动位置。
if (typeof window !== "undefined" && typeof window.history !== "undefined") {
  try {
    window.history.scrollRestoration = "manual";
  } catch {
    // ignore
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
