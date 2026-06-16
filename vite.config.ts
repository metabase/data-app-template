import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { type LibraryFormats, defineConfig } from "vite";
import { findEnvRoot } from "./config/env-root";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  envDir: findEnvRoot(appRoot),
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/index.tsx",
      formats: ["iife"] satisfies LibraryFormats[],
      fileName: () => "index.js",
      name: "__dataAppFactory__",
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "@metabase/embedding-sdk-react",
        "@metabase/embedding-sdk-react/data-app",
      ],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "__react_jsx_runtime__",
          "@metabase/embedding-sdk-react": "__metabase_sdk__",
          "@metabase/embedding-sdk-react/data-app": "__metabase_data_app__",
        },
      },
    },
  },
  server: { port: 5174, host: "localhost" },
}));
