import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 5173,
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        env.NEXT_PUBLIC_SUPABASE_URL ||
          env.VITE_SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL,
      ),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          env.VITE_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
      "import.meta.env.VITE_PRESENTE_X_PASSWORD": JSON.stringify(
        env.PRESENTE_X_PASSWORD || process.env.PRESENTE_X_PASSWORD,
      ),
    },
    // Include GLB assets so Vite doesn't attempt to parse them as JS
    assetsInclude: ["**/*.glb"],
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean,
    ),
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
