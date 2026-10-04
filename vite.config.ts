import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["5173-i7s2dgu1zg6u5m7d4rxe7-9f7b47d2.sg2.manus.computer"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        configure(proxy) {
          proxy.on("proxyReq", (proxyRequest, request) => {
            const host = String(request.headers.host || "");
            const forwarded = String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim();
            const isLocal = /^(localhost|127\.0\.0\.1)(:\\d+)?$/.test(host);
            proxyRequest.setHeader("X-Forwarded-Proto", forwarded || (isLocal ? "http" : "https"));
            proxyRequest.setHeader("X-Forwarded-Host", host);
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
