import type { Work } from "./types";
import { WORK_IMAGE_WHITE_FALLBACK } from "./placeholders";

export const work02: Work = {
  id: "2",
  title: "Aro",
  image: WORK_IMAGE_WHITE_FALLBACK,
  cardImageAspectRatio: 1 / 0.7,
  cardImageHeightPx: 400,
  overlayIcon: "./works/aro/aro-icon.svg",
  tags: ["品牌", "视觉"],
  tagsEn: ["Brand", "Visuals"],
  date: "2025/05/01",
  cardIntro: "AI 角色陪伴与开放剧情对话体验探索，面向沉浸式聊天与轻社交",
  cardIntroEn: "AI character companionship and open-story dialogue for immersive chats.",
  detailTitle: "Aro",
  detailTitleEn: "Aro",
  typeLabel: "AI 对话陪伴 / 角色互动",
  typeLabelEn: "AI Companion Dialogue / Character Interaction",
  details: [
    { label: "类别", value: "AI 对话陪伴 / 角色互动" },
    { label: "时间", value: "2025.05 - 2025.06" },
    { label: "关键词", value: "AI 对话、角色互动、开放剧情、沉浸交互" },
    { label: "角色", value: "UI 设计（实习）" },
  ],
  detailsEn: [
    { label: "Category", value: "AI Companion Dialogue / Character Interaction" },
    { label: "Timeline", value: "2025.05 - 2025.06" },
    { label: "Keywords", value: "AI Dialogue, Character Interaction, Open Story, Immersive UX" },
    { label: "Role", value: "UI Designer (Intern)" },
  ],
  overview:
    "Aro 是一款以 AI 角色为核心的智能对话陪伴工具，专注于有趣的开放剧情互动与更自然的聊天体验。无论是日常沟通、情境对话还是轻量语音互动，都能让对话更有温度、像真的在交流。项目负责：梳理信息层级、统一交互组件，并将设计语言落到可复用的原型与视觉规范中。",
  overviewEn:
    "Aro is an AI character-driven conversation companion focused on open-story interaction and natural dialogue. I worked on information hierarchy, unified interaction components, and reusable design language in prototypes and visual guidelines.",
  layout: "half",
  cardCover: {
    background: {
      type: "reactbits",
      effect: "aurora",
      params: {
        color1: "6a1f16",
        color2: "7e2216",
        color3: "a33c2e",
        blend: 0.55,
        speed: 1.5,
      },
      fallbackColor: "#000000",
    },
    foreground: {
      type: "image",
      src: "./works/aro/aro_up.webp",
      placement: {
        mode: "anchorPosition",
        coordinate: { x: -9, y: -6 },
        anchor: { x: 0, y: 1 },
        widthRatio: 1.2,
      },
      preserveAspectRatio: true,
    },
  },
  detailImages: [
    "./works/aro/07-02.webp",
    "./works/aro/07-03.webp",
    "./works/aro/07-04.webp",
    "./works/aro/07-05.webp",
  ],
};
