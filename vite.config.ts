import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 构建时列出 public/album 下的文件名，供首页音乐区只展示真实存在的资源 */
function albumExistingPlugin() {
  const resolved = "\0virtual:album-existing";
  return {
    name: "virtual-album-existing",
    resolveId(id: string) {
      if (id === "virtual:album-existing") return resolved;
    },
    load(id: string) {
      if (id !== resolved) return null;
      const dir = path.resolve(__dirname, "public/album");
      let names: string[] = [];
      try {
        names = fs
          .readdirSync(dir, { withFileTypes: true })
          .filter((d) => d.isFile() && !d.name.startsWith("."))
          .map((d) => d.name);
      } catch {
        names = [];
      }
      return `export default ${JSON.stringify(names)}`;
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), albumExistingPlugin()],
  server: {
    port: 4414,
  },
});
