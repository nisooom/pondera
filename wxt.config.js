import { build, defineConfig } from "wxt";
import react from "@vitejs/plugin-react";
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  // Basic extension info
  manifest: {
    web_accessible_resources: [
      {
        resources: ["index.html"],
        matches: ["<all_urls>"],
      },
    ],
    name: "Pondera",
    version: "1.0.0",
    description:
      "Pondera is a journaling app that helps you track your mood and thoughts.",
    permissions: ["storage"],
    // Allows using console.log and debugger in development
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
    vite: () => ({
      plugins: [react()],
    }),
  },
});
