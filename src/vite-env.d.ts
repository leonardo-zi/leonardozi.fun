/// <reference types="vite/client" />

/** Vite `define`：HEAD 提交日 YYYY-MM-DD，无 git 时为空串 */
declare const __SITE_LAST_COMMIT_DATE__: string;

declare module "virtual:album-existing" {
  const files: readonly string[];
  export default files;
}
