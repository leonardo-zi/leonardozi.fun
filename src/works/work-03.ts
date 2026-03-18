import type { Work } from "./types";

export const work03: Work = {
  id: "3",
  title: "江畔晚照",
  image: "./works/bg/苏崇铭8.webp",
  tags: ["网页"],
  date: "2025/01/01",
  typeLabel: "作品三 / 网页",
  details: [
    { label: "作品类型", value: "单页落地页布局" },
    { label: "时间", value: "2025/01" },
    { label: "关键词", value: "栅格、排版节奏、动效细节" },
    { label: "实现", value: "React / Tailwind / Vite" },
  ],
  overview:
    "这页更关注“读起来舒服”：控制段落宽度、行高与对比度，让信息密度可控；动效只出现在关键转场，尽量不打断阅读流。",
  layout: "half",
};
