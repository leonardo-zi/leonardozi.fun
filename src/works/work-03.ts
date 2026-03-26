import type { Work } from "./types";

export const work03: Work = {
  id: "3",
  title: "Bob Music",
  image: "./works/bg/苏崇铭8.webp",
  cardImageHeightPx: 350,
  overlayIcon: "./works/bobmusic/bobmusic-icon.svg",
  tags: ["网页"],
  tagsEn: ["Webpage"],
  date: "2025/01/01",
  cardIntro: "单页网页练习，聚焦栅格与排版节奏。",
  cardIntroEn: "Single-page web study focused on grid and typographic rhythm.",
  typeLabel: "作品三 / 网页",
  typeLabelEn: "Work 03 / Webpage",
  details: [
    { label: "作品类型", value: "单页落地页布局" },
    { label: "时间", value: "2025/01" },
    { label: "关键词", value: "栅格、排版节奏、动效细节" },
    { label: "实现", value: "React / Tailwind / Vite" },
  ],
  detailsEn: [
    { label: "Type", value: "Single-Page Landing Layout" },
    { label: "Time", value: "2025/01" },
    { label: "Keywords", value: "Grid, Typographic Rhythm, Motion Details" },
    { label: "Build", value: "React / Tailwind / Vite" },
  ],
  overview:
    "这页更关注\"读起来舒服\"：控制段落宽度、行高与对比度，让信息密度可控；动效只出现在关键转场，尽量不打断阅读流。",
  overviewEn:
    "This page focuses on reading comfort: controlling paragraph width, line-height, and contrast to keep information density in balance. Motion appears only in key transitions, so it doesn't interrupt the reading flow.",
  layout: "half",
  detailImages: [
    "./works/bobmusic/08-02.webp",
    "./works/bobmusic/08-03.webp",
    "./works/bobmusic/08-04.webp",
    "./works/bobmusic/08-05.webp",
    "./works/bobmusic/08-06.webp",
    "./works/bobmusic/08-07.webp",
    "./works/bobmusic/08-08.webp",
    "./works/bobmusic/08-09.webp",
    "./works/bobmusic/08-10.webp",
    "./works/bobmusic/08-11.webp",
  ],
};
