import { defineConfig } from "vite";

export default defineConfig({
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: true, // Auto-open browser
  },

  // Build configuration
  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    sourcemap: false,

    // Bundle optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks if needed in the future
        },
      },
    },

    // Asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },

  // Asset processing
  assetsInclude: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif"],

  // Environment variables prefix
  envPrefix: "VITE_",

  // Base path for deployment
  base: "./",

  // CSS configuration
  css: {
    devSourcemap: true,
  },

  // Preview server (for production builds)
  preview: {
    port: 4173,
    host: true,
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  // Optimization
  optimizeDeps: {
    include: [], // Add dependencies that should be pre-bundled
  },
});
