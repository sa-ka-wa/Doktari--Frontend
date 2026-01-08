import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Check if we're in production
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@t-shirt/shared": path.resolve(__dirname, "../shared/src"),
      "@admin": path.resolve(__dirname, "../admin-app/src/"),
    },
  },

  // Production settings
  build: {
    outDir: "dist", // Vite's default output directory
    sourcemap: isProduction ? false : true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },

  // Server settings (only for development)
  server: !isProduction
    ? {
        host: "doktari.lvh.me",
        port: 3003, // Changed to 3003 to match your logs
        open: true,
        fs: { allow: [".."] },
        proxy: {
          "/api": {
            target: "http://localhost:5000",
            changeOrigin: true,
            secure: false,
          },
        },
      }
    : undefined,

  // Base URL for production - IMPORTANT!
  base: isProduction ? "/" : "/",

  // Environment variables
  define: {
    "process.env": process.env,
  },
});
