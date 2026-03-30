/** 侧栏「分区」导航：与 Route 路径对齐；扩展时在此加一项并注册 Route。 */

export type SidebarNavItem = {
  to: string;
  labelCn: string;
  labelEn: string;
  /** 传给 NavLink 的 end，避免 `/` 匹配所有路径 */
  end?: boolean;
};

export const SIDEBAR_SECTION_NAV: SidebarNavItem[] = [
  { to: "/", labelCn: "作品", labelEn: "Works", end: true },
  { to: "/music", labelCn: "音乐", labelEn: "Music" },
];
