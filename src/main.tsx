import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

const mountNode = document.getElementById("root");

if (mountNode) {
  createRoot(mountNode).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>
  );
} else {
  console.error("The application root element #root is missing from index.html.");
  const fallback = document.createElement("main");
  fallback.lang = "ar";
  fallback.dir = "rtl";
  fallback.textContent = "تعذر تحميل المنصة: عنصر التطبيق غير موجود في الصفحة. أعد تحميل الصفحة أو تحقق من ملفات البناء.";
  fallback.style.cssText = "max-width:720px;margin:15vh auto;padding:32px;font:700 18px/2 system-ui;color:#7f1d1d;background:#fff7ed;border:1px solid #fed7aa;border-radius:24px";
  document.body.replaceChildren(fallback);
}
