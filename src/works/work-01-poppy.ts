import type { Work } from "./types";
import { WORK_IMAGE_WHITE_FALLBACK } from "./placeholders";

export const work01Poppy: Work = {
  id: "1",
  title: "Poppy",
  image: WORK_IMAGE_WHITE_FALLBACK,
  cardImageAspectRatio: 1 / 1.3,
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
  date: "2025/04/01",
  cardIntro: "AI 聊天机器人与开放剧情对话体验，覆盖日常闲聊与语音陪伴",
  cardIntroEn: "AI chatbot with open-story interaction for daily chat and voice companionship.",
  detailTitle: "Poppy AI 对话聊天软件",
  detailTitleEn: "Poppy AI Conversation Chat App",
  typeLabel: "AI 社交 / C端应用",
  typeLabelEn: "AI Social / Consumer App",
  details: [
    { label: "类别", value: "AI 社交 / C端应用" },
    { label: "时间", value: "2025.04 - 2025.05" },
    { label: "关键词", value: "视觉调性、多平台适配、动效表达、品牌设计" },
    { label: "角色", value: "UI 设计师（实习）" },
  ],
  detailsEn: [
    { label: "Category", value: "AI Social / Consumer App" },
    { label: "Timeline", value: "2025.04 - 2025.05" },
    { label: "Keywords", value: "Visual Tone, Cross-platform Adaptation, Motion, Branding" },
    { label: "Role", value: "UI Designer (Intern)" },
  ],
  overview:
    "Poppy AI 是一款功能强大的 AI 聊天机器人与智能对话工具，提供有趣的开放剧情互动与更逼真的对话体验。无论是日常闲聊还是语音聊天，都能把沟通变得更轻松、更沉浸。项目中我主导跨端视觉与交互语言的统一：从图标系统、交互控件到动效节奏与品牌商店物料落地。",
  overviewEn:
    "Poppy AI is a chatbot and intelligent conversation product with open-story interaction and immersive communication. I led cross-platform visual and interaction unification, covering icon systems, controls, motion rhythm, and branded store assets.",
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
