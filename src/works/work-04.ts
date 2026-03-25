import type { Work } from "./types";

export const work04: Work = {
  id: "4",
  title: "Others",
  image: "./works/bg/苏崇铭4.webp",
  overlayIcon: "./works/leonardozi/leonardozi-icon.svg",
  tags: ["网页"],
  tagsEn: ["Webpage"],
  date: "2025/01/01",
  typeLabel: "作品四 / 网页",
  typeLabelEn: "Work 04 / Webpage",
  details: [
    { label: "作品类型", value: "组件化页面结构" },
    { label: "时间", value: "2025/01" },
    { label: "关键词", value: "可复用、状态、细节一致性" },
    { label: "输出", value: "基础组件 + 页面模板" },
  ],
  detailsEn: [
    { label: "Type", value: "Componentized Page Structure" },
    { label: "Time", value: "2025/01" },
    { label: "Keywords", value: "Reusability, States, Detail Consistency" },
    { label: "Output", value: "Base Components + Page Templates" },
  ],
  overview:
    "用更\"系统化\"的方式组织页面：把间距、圆角与交互状态统一，减少视觉漂移；内容层级更清晰，后续迭代可以更快更稳。",
  overviewEn:
    "Organize pages in a more \"systematic\" way: unify spacing, corner radii, and interaction states to reduce visual drift. Clearer hierarchy makes iteration faster and steadier.",
  layout: "half",
  detailImages: [
    "./works/leonardozi/11-02.webp",
    "./works/leonardozi/11-03.webp",
    "./works/leonardozi/11-04.webp",
    "./works/leonardozi/11-05.webp",
  ],
};
