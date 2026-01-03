// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: "localhost",

    // ⭐ REQUIRED FOR GOOGLE POPUP LOGIN (FedCM fallback)
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },

    // ⭐ API proxy
    proxy: {
      "/api": {
        target: "https://mern-tourism-web-app.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
