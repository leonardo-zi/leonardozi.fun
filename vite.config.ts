import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 构建时列出 public/album 下的文件名，供首页音乐区只展示真实存在的资源 */
function albumExistingPlugin(): Plugin {
  const resolved = "\0virtual:album-existing";
  const albumDir = path.resolve(__dirname, "public/album");
  return {
    name: "virtual-album-existing",
    resolveId(id: string) {
      if (id === "virtual:album-existing") return resolved;
    },
    configureServer(server) {
      server.watcher.add(albumDir);
    },
    load(id: string) {
      if (id !== resolved) return null;
      let names: string[] = [];
      try {
        const dirents = fs.readdirSync(albumDir, { withFileTypes: true });
        names = dirents.filter((d) => d.isFile() && !d.name.startsWith(".")).map((d) => d.name);
      } catch {
        names = [];
      }
      // 勿对此处使用 this.addWatchFile(绝对路径)：Vite 6 会把目录路径误当作 import，导致
      // “Failed to resolve import .../public/album from virtual:album-existing”。
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
