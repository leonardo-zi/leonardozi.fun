import type { Work } from "./types";

export const work00Tenet: Work = {
  id: "0",
  title: "Tenet",
  // Tenet 卡片不展示背景图（用纯色封面渲染），但 Work.image 目前为必填字段，这里给一个可用兜底
  image: "./works/tenet/01.webp",
  cardImageAspectRatio: 1,
  tags: ["产品"],
  tagsEn: ["Product"],
  date: "2026/03/31",
  cardIntro: "占位文案：产品体验与界面方向探索。",
  cardIntroEn: "Placeholder copy: product experience and interface direction exploration.",
  typeLabel: "作品 / 产品",
  typeLabelEn: "Work / Product",
  details: [
    { label: "作品类型", value: "产品体验探索（占位）" },
    { label: "时间", value: "2026/03" },
    { label: "关键词", value: "结构、交互、信息层级" },
    { label: "产出", value: "封面 + 详情图（后续替换）" },
  ],
  detailsEn: [
    { label: "Type", value: "Product Experience Exploration (Placeholder)" },
    { label: "Time", value: "2026/03" },
    { label: "Keywords", value: "Structure, Interaction, Information Hierarchy" },
    { label: "Deliverables", value: "Cover + Detail Images (To be replaced)" },
  ],
  overview:
    "占位文案：Tenet 目前用于承载新方向的视觉与交互实验，先以最小可展示版本接入主页与详情页，后续会统一替换为正式项目说明与完整素材。",
  overviewEn:
    "Placeholder copy: Tenet currently serves as a container for visual and interaction experiments. It is integrated into Home and Detail pages with a minimal presentable version, and will later be replaced by final project copy and assets.",
  layout: "half",
  cardCover: {
    background: { type: "color", color: "#000000" },
    foreground: {
      type: "video",
      src: "./works/tenet/tenet.webm",
      placement: { mode: "centerRatio", widthRatio: 0.55 },
      playbackRate: 1.2,
      autoPlay: true,
      muted: true,
      loop: true,
      playsInline: true,
      controls: false,
      preload: "metadata",
    },
  },
  detailImages: [
    "./works/tenet/01.webp",
    "./works/tenet/02.webp",
    "./works/tenet/03.webp",
    "./works/tenet/04.webp",
    "./works/tenet/05.webp",
    "./works/tenet/06.webp",
    "./works/tenet/07.webp",
    "./works/tenet/08.webp",
    "./works/tenet/09.webp",
    "./works/tenet/10.webp",
    "./works/tenet/11.webp",
  ],
};
