import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === "production" ? "/Vidyut-Portfolio/" : "/";
  
  return {
    base,
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(), 
      mode === "development" && componentTagger(),
      // Copy index.html to 404.html for GitHub Pages SPA routing
      {
        name: "copy-404",
        closeBundle() {
          if (mode === "production") {
            const distPath = path.resolve(__dirname, "dist");
            const indexPath = path.join(distPath, "index.html");
            const notFoundPath = path.join(distPath, "404.html");
            
            if (fs.existsSync(indexPath)) {
              fs.copyFileSync(indexPath, notFoundPath);
              console.log("✓ Copied index.html to 404.html for GitHub Pages");
            }
          }
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
