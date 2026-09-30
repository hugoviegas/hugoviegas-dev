import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Emit dist/404.html from the built index.html. Vercel serves it with a real
// 404 status for paths not listed in vercel.json rewrites; the SPA then
// renders the NotFound route.
const notFoundPage = (): Plugin => {
  let outDir = "dist";
  return {
    name: "not-found-page",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const html = fs
        .readFileSync(indexPath, "utf-8")
        .replace(
          /<title>[\s\S]*?<\/title>/,
          "<title>Page Not Found | Hugo Viegas</title>",
        )
        .replace(
          "</head>",
          '  <meta name="robots" content="noindex, nofollow" />\n  </head>',
        );
      fs.writeFileSync(path.join(outDir, "404.html"), html);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "::",
      port: 5173,
    },
    // Include GLB assets so Vite doesn't attempt to parse them as JS
    assetsInclude: ["**/*.glb"],
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      notFoundPage(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["three"],
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            const normalizedId = id.replace(/\\/g, "/");
            if (normalizedId.includes("/node_modules/")) {
              if (
                normalizedId.includes("three") ||
                normalizedId.includes("@react-three/fiber") ||
                normalizedId.includes("@react-three/drei")
              ) {
                return "vendor-r3f";
              }
              if (normalizedId.includes("lucide-react")) {
                return "vendor-icons";
              }
            }

            if (normalizedId.includes("/src/assets/3d-model/")) {
              return "chunk-3d-models";
            }

            return undefined;
          },
        },
      },
    },
  };
});
