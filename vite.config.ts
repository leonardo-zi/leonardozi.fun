import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** HEAD 最后一次提交的日历日（YYYY-MM-DD），供侧栏「编辑于」；dev/build 各读一次 */
function getSiteLastCommitDate(): string {
  const fromEnv = process.env.VITE_LAST_COMMIT_DATE?.trim();
  if (fromEnv && ISO_DATE_RE.test(fromEnv)) return fromEnv;
  try {
    const out = execSync("git log -1 --format=%cs", {
      encoding: "utf-8",
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (ISO_DATE_RE.test(out)) return out;
  } catch {
    /* 非 git 仓库或 git 不可用 */
  }
  return "";
}

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
  // 使用绝对路径，保证在 /work/:id 等深链刷新时仍能正确加载 /assets/*
  base: "/",
  define: {
    __SITE_LAST_COMMIT_DATE__: JSON.stringify(getSiteLastCommitDate()),
  },
  plugins: [react(), tailwindcss(), albumExistingPlugin()],
  server: {
    port: 4414,
  },
});
