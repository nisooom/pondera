import { defineConfig } from 'wxt';

export default defineConfig({

  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  // Basic extension info
  manifest: {
    name: 'Pondera',
    version: '1.0.0',
    description: 'Pondera is a journaling app that helps you track your mood and thoughts.',
    permissions: [
      'storage'
    ],
    // Allows using console.log and debugger in development
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
    }
  },
});
