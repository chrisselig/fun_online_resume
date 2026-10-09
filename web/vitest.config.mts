import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    // This design variant has no algorithmic logic (unlike circlePack.ts
    // in other branches) — just JSX. Nothing to unit test.
    passWithNoTests: true,
  },
});
