import type { Work } from "./types";

export const work01Poppy: Work = {
  id: "1",
  title: "Poppy",
  image: "./works/poppy/poppy-bg.png",
  overlayIcon: "./works/poppy/Poppy-icon.svg",
  detailImages: [
    "./works/poppy/poppy-1.webp",
    "./works/poppy/poppy-2.webp",
    "./works/poppy/poppy-3.webp",
    "./works/poppy/poppy-4.webp",
  ],
  tags: ["界面", "原型"],
  date: "2025/03/01",
  typeLabel: "作品一 / 界面与原型",
  details: [
    { label: "作品类型", value: "移动端界面探索" },
    { label: "时间", value: "2025/03" },
    { label: "关键词", value: "构图、层级、动效节奏" },
    { label: "产出", value: "封面 + 4 张展示图" },
  ],
  overview:
    "Poppy 是一组偏视觉与结构的界面练习：用更克制的色彩与更清晰的层级来承载内容，同时通过轻量过渡保证浏览顺滑。重点在于把“第一眼能看懂”与“细节耐看”同时兼顾。",
  layout: "full",
};

