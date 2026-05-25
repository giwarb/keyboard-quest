import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vitest/config";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  base: repoName ? `/${repoName}/` : "./",
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
