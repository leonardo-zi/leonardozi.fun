import type { Work } from "./types";

export const work01Poppy: Work = {
  id: "1",
  title: "Poppy",
  image: "./works/bg/苏崇铭2.webp",
  cardImageHeightPx: 710,
  overlayIcon: "./works/poppy/Poppy-icon.svg",
  detailMedia: [
    { type: "image", src: "./works/poppy/poppy-1.webp" },
    { type: "image", src: "./works/poppy/poppy-2.webp" },
    { type: "image", src: "./works/poppy/poppy-3.webp" },
    { type: "video", src: "./works/poppy/poppy-4.webm" },
    { type: "image", src: "./works/poppy/poppy-5.webp" },
  ],
  tags: ["界面", "原型"],
  tagsEn: ["Interface", "Prototype"],
  date: "2025/03/01",
  cardIntro: "移动端界面练习，强调清晰层级与易读性。",
  cardIntroEn: "Mobile UI study focused on clear hierarchy and readability.",
  typeLabel: "作品一 / 界面与原型",
  typeLabelEn: "Work 01 / Interface & Prototype",
  details: [
    { label: "作品类型", value: "移动端界面探索" },
    { label: "时间", value: "2025/03" },
    { label: "关键词", value: "构图、层级、动效节奏" },
    { label: "产出", value: "封面 + 4 张展示图" },
  ],
  detailsEn: [
    { label: "Type", value: "Mobile Interface Exploration" },
    { label: "Time", value: "2025/03" },
    { label: "Keywords", value: "Composition, Hierarchy, Motion Rhythm" },
    { label: "Deliverables", value: "Cover + 4 Showcase Images" },
  ],
  overview:
    "Poppy 是一组偏视觉与结构的界面练习：用更克制的色彩与更清晰的层级来承载内容，同时通过轻量过渡保证浏览顺滑。重点在于把“第一眼能看懂”与“细节耐看”同时兼顾。",
  overviewEn:
    "Poppy is a set of interface exercises focused on visual structure: using calmer color and clearer hierarchy to carry content, while keeping transitions light to ensure a smooth reading experience. The goal is to balance “understand at first glance” with “details that last.”",
  layout: "full",
  cardCover: {
    background: { type: "image", src: "./works/poppy/poppy_bg.webp" },
    foreground: {
      type: "image",
      src: "./works/poppy/poppy_up.webp",
      placement: { mode: "centerRatio", widthRatio: 0.6 },
      preserveAspectRatio: true,
    },
  },
};
