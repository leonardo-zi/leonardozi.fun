import type { Work } from "./types";

export const work04: Work = {
  id: "4",
  title: "远山疏林",
  image: "./works/bg/苏崇铭4.webp",
  tags: ["网页"],
  date: "2025/01/01",
  typeLabel: "作品四 / 网页",
  details: [
    { label: "作品类型", value: "组件化页面结构" },
    { label: "时间", value: "2025/01" },
    { label: "关键词", value: "可复用、状态、细节一致性" },
    { label: "输出", value: "基础组件 + 页面模板" },
  ],
  overview:
    "用更“系统化”的方式组织页面：把间距、圆角与交互状态统一，减少视觉漂移；内容层级更清晰，后续迭代可以更快更稳。",
  layout: "half",
};
