import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent ?? "";
  const platform = (navigator as unknown as { platform?: string }).platform ?? "";
  const maxTouchPoints = navigator.maxTouchPoints ?? 0;

  // iPadOS 13+ 常见特征：platform 为 MacIntel + 支持触控点
  const isIpadOs = platform === "MacIntel" && maxTouchPoints > 1;

  return (
    /Mac|iPhone|iPad|iPod/i.test(platform) ||
    /Macintosh|Mac OS X|iPhone|iPad|iPod/i.test(ua) ||
    isIpadOs
  );
}

if (typeof document !== "undefined") {
  if (isApplePlatform()) {
    document.documentElement.dataset.platform = "apple";
  } else {
    delete document.documentElement.dataset.platform;
  }
}

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
