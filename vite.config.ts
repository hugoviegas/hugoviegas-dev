import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { resolveRouteHead, staticHeadFile, staticHeadRoutes } from "./src/config/seo";
import { heroPreloadTag, injectRouteHead, stripHomeOnly } from "./src/config/seoHtml";
import { parseProfilePhoto } from "./src/content/siteFiles";
import { getTranslation } from "./src/config/translations";

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
      const html = stripHomeOnly(fs.readFileSync(indexPath, "utf-8"))
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

// Preload the uploaded hero photo from the content snapshot (written by
// prebuild). Without one, the bundled photo loads as before. A new upload
// reaches this tag on the next deploy; the page itself updates at runtime.
const heroPhotoPreload = (): Plugin => ({
  name: "hero-photo-preload",
  apply: "build",
  transformIndexHtml(html) {
    const snapshotPath = path.resolve(__dirname, "src/content/snapshot/core.json");
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf-8"));
    // Preload the uploaded image of the face the hero shows first.
    const first = snapshot.files?.avatarFirst === "minifig" ? "avatarMinifig" : "profilePhoto";
    const photo = parseProfilePhoto(snapshot.files?.[first]);
    if (!photo) return html;
    return html.replace("</head>", `  ${heroPreloadTag(photo.url)}
  </head>`);
  },
});

// Write a head-only HTML file per public route (title, description, canonical,
// Open Graph, BreadcrumbList) so the raw HTML is correct for scrapers that do
// not run JS. The body stays the SPA shell. vercel.json rewrites each route to
// its file. Uses the English strings: the default language, no localized routes.
const routeHeadPages = (): Plugin => {
  let outDir = "dist";
  return {
    name: "route-head-pages",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const indexHtml = fs.readFileSync(indexPath, "utf-8");
      const t = (key: string) => getTranslation(key, "EN");
      for (const route of staticHeadRoutes()) {
        const target = path.join(outDir, staticHeadFile(route));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(
          target,
          injectRouteHead(indexHtml, resolveRouteHead(route, t)),
        );
      }
    },
  };
};

// Dev only: serve POST /api/chat from api/chat.ts so `npm run dev` can talk
// to the assistant. GEMINI_API_KEY is read here from .env.local on the dev
// machine and stays server-side (it is not a VITE_* variable).
const devChatApi = (env: Record<string, string>): Plugin => ({
  name: "dev-chat-api",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/api/chat", async (req, res) => {
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (typeof value === "string") headers.set(key, value);
        }
        const request = new Request(`http://localhost${req.url ?? ""}`, {
          method: req.method,
          headers,
          body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
        });
        const mod = await server.ssrLoadModule("/api/chat.ts");
        const { RateLimiter } = await server.ssrLoadModule("/src/server/chat/rateLimit.ts");
        const response: Response = await mod.handleChat(request, {
          apiKey: env.GEMINI_API_KEY,
          allowedOrigins: mod.allowedOriginsFromEnv({ VERCEL_ENV: "development" }),
          limiter: (globalThis as { __devChatLimiter?: unknown }).__devChatLimiter ??= new RateLimiter(),
        });
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      } catch (error) {
        server.config.logger.error(`dev /api/chat failed: ${(error as Error).message}`);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "dev_server_error" }));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // All env vars (not just VITE_*), for the dev-only chat middleware.
  const serverEnv = loadEnv(mode, process.cwd(), "");
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
      devChatApi(serverEnv),
      heroPhotoPreload(),
      notFoundPage(),
      routeHeadPages(),
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
            // Shared build helpers (Vite's dynamic-import preload helper and
            // Rollup's CommonJS interop) must not be captured into vendor-r3f,
            // or the entry would import, and preload, that chunk.
            if (
              normalizedId.includes("vite/preload-helper") ||
              normalizedId.includes("commonjsHelpers")
            ) {
              return "vendor-react";
            }
            if (normalizedId.includes("/node_modules/")) {
              // Pin React to its own chunk. Otherwise Rollup pulls react-dom
              // and scheduler into vendor-r3f (as dependencies of
              // @react-three/fiber), forcing three.js onto every page.
              if (
                /\/node_modules\/(react|react-dom|scheduler)\//.test(
                  normalizedId,
                )
              ) {
                return "vendor-react";
              }
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
