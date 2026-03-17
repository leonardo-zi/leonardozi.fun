/** 样式相关：full 卡片占两列、图片 3:2 长方形；half 占一列、图片 1:1 正方形 */
export type WorkLayout = "full" | "half";

export interface Work {
  id: string;
  title: string;
  image: string;   // 卡片缩略图，相对于 public
  detailImages?: string[]; // 弹窗内多图，不填则用 [image]
  tags: string[];
  date: string;
  /** 弹窗顶部信息（可选） */
  typeLabel?: string; // 作品类型/项目类型，如 "Product Design" / "Web" / "Branding"
  details?: Array<{ label: string; value: string }>;
  overview?: string;
  layout: WorkLayout;
}

/** works 文件夹下的 webp，顺序固定：最上面作品用 2.webp，其余按此顺序轮询 */
const WORKS_WEBP = [
  "./works/2.webp",
  "./works/1.WEBP",
  "./works/3.webp",
  "./works/4.webp",
  "./works/5.webp",
];

const worksBase: Omit<Work, "image" | "detailImages">[] = [
  {
    id: "1",
    title: "山雨初晴",
    tags: ["界面", "原型"],
    date: "2025/03/01",
    typeLabel: "界面 / 原型",
    details: [
      { label: "作品类型", value: "交互概念与界面探索" },
      { label: "时间", value: "2025 春季（2 周）" },
      { label: "关键词", value: "版式、动效、信息层级、可用性" },
      { label: "工具", value: "Figma / Framer / Vite" },
    ],
    overview:
      "以“留白 + 轻量动效”为主线，把内容放在第一位：卡片只呈现必要线索，打开后用更强的排版层级承载细节。整体目标是让浏览节奏更平稳，信息更好读。",
    layout: "full",
  },
  {
    id: "2",
    title: "云栖谷口",
    tags: ["品牌", "视觉"],
    date: "2025/02/01",
    typeLabel: "品牌 / 视觉",
    details: [
      { label: "作品类型", value: "品牌视觉小体系" },
      { label: "时间", value: "2025 冬季（1 周）" },
      { label: "关键词", value: "色彩、字重对比、图形语言" },
      { label: "交付", value: "主视觉、图标、版式模板" },
    ],
    overview:
      "虚构一个“山谷旅居”品牌的视觉方向：用低饱和色与轻柔对比建立气质，用可复用的版式组件保证一致性，适合在不同媒介上快速扩展。",
    layout: "half",
  },
  {
    id: "3",
    title: "江畔晚照",
    tags: ["网页"],
    date: "2025/01/01",
    typeLabel: "网页 / 落地页",
    details: [
      { label: "作品类型", value: "单页站点与响应式布局" },
      { label: "时间", value: "2025 年初（3 天）" },
      { label: "关键词", value: "栅格、排版节奏、动效细节" },
      { label: "实现", value: "React / Tailwind / Vite" },
    ],
    overview:
      "围绕“阅读体验”做的一页式结构：通过标题层级、段落宽度与行高控制阅读压力，动效只在关键转场出现，避免打断内容。",
    layout: "half",
  },
  {
    id: "4",
    title: "远山疏林",
    tags: ["网页"],
    date: "2025/01/01",
    typeLabel: "网页 / 组件化",
    details: [
      { label: "作品类型", value: "组件拆分与样式规范" },
      { label: "时间", value: "2025 年初（4 天）" },
      { label: "关键词", value: "可复用、状态、细节一致性" },
      { label: "输出", value: "基础组件 + 页面模板" },
    ],
    overview:
      "用小型设计系统的方式组织网页：把常用的间距、圆角、阴影与交互状态抽成统一规则，页面搭建更快，同时保证视觉风格不漂移。",
    layout: "half",
  },
  {
    id: "5",
    title: "溪桥烟树",
    tags: ["网页"],
    date: "2025/01/01",
    typeLabel: "网页 / 叙事",
    details: [
      { label: "作品类型", value: "图文叙事页面" },
      { label: "时间", value: "2025 年初（2 天）" },
      { label: "关键词", value: "图文比例、段落节奏、滚动体验" },
      { label: "关注点", value: "轻量、顺滑、可读" },
    ],
    overview:
      "尝试用更“杂志化”的编排方式讲故事：让图片承担情绪，让文字承担信息，通过留白与对齐关系把视线引导得更自然。",
    layout: "half",
  },
  {
    id: "6",
    title: "松风听泉",
    tags: ["界面", "原型"],
    date: "2025/03/01",
    typeLabel: "界面 / 交互",
    details: [
      { label: "作品类型", value: "交互原型与动效" },
      { label: "时间", value: "2025 春季（1 周）" },
      { label: "关键词", value: "反馈、过渡、层级、动线" },
      { label: "目标", value: "让操作更明确、更有“呼吸感”" },
    ],
    overview:
      "这个练习聚焦“操作反馈”：把点击、切换、打开/关闭的过渡做得更干净，减少突兀跳变；同时让信息层级更清晰，第一眼就能知道下一步该做什么。",
    layout: "full",
  },
];

export const works: Work[] = worksBase.map((w, i) => {
  const image = WORKS_WEBP[i % WORKS_WEBP.length];
  const detailImages = [
    WORKS_WEBP[i % WORKS_WEBP.length],
    WORKS_WEBP[(i + 1) % WORKS_WEBP.length],
    WORKS_WEBP[(i + 2) % WORKS_WEBP.length],
  ];
  return { ...w, image, detailImages };
});
