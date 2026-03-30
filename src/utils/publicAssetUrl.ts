/**
 * 将数据里存的 `./works/...` 转为可在任意路由下加载的绝对 URL。
 * 浏览器会把 `./` 解析为「当前路径的目录」，在 `/work/1` 下会变成 `/work/works/...` 从而 404。
 */
export function publicAssetUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const clean = path.replace(/^\.\//, "");
  if (typeof window === "undefined") {
    const b = import.meta.env.BASE_URL;
    const base = b.endsWith("/") ? b : `${b}/`;
    return `${base}${clean}`;
  }

  const { origin, pathname } = window.location;
  const workIdx = pathname.indexOf("/work/");
  let root = "";
  if (workIdx >= 0) {
    root = pathname.slice(0, workIdx);
  } else if (pathname === "/music" || pathname.startsWith("/music/")) {
    root = pathname.replace(/\/music\/?.*$/, "") || "";
  }

  const prefix = root === "" || root === "/" ? "" : root.replace(/\/$/, "");
  return `${origin}${prefix}/${clean}`.replace(/([^:]\/)\/+/g, "$1");
}
