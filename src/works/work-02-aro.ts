import type { Work } from "./types";

export const work02: Work = {
  id: "2",
  title: "Aro",
  image: "./works/bg/苏崇铭5.webp",
  cardImageAspectRatio: 1 / 0.7,
  cardImageHeightPx: 400,
  overlayIcon: "./works/aro/aro-icon.svg",
  tags: ["品牌", "视觉"],
  tagsEn: ["Brand", "Visuals"],
  date: "2025/02/01",
  cardIntro: "品牌视觉小体系探索，统一色彩与图形语言。",
  cardIntroEn: "Mini brand visual system study with unified color and graphic language.",
  typeLabel: "作品二 / 品牌与视觉",
  typeLabelEn: "Work 02 / Brand & Visuals",
  details: [
    { label: "作品类型", value: "品牌视觉小体系" },
    { label: "时间", value: "2025/02" },
    { label: "关键词", value: "色彩、字重对比、图形语言" },
    { label: "交付", value: "主视觉 / 图标 / 版式模板" },
  ],
  detailsEn: [
    { label: "Type", value: "A Mini Visual System for the Brand" },
    { label: "Time", value: "2025/02" },
    { label: "Keywords", value: "Color, Font-Weight Contrast, Graphic Language" },
    { label: "Deliverables", value: "Key Visual / Icons / Layout Templates" },
  ],
  overview:
    "这是一次虚构品牌方向的快速探索：先确定气质（轻、静、克制），再把它落到可复用的排版与图形规则里，确保在不同尺寸与媒介上都能保持一致的识别感。",
  overviewEn:
    "A quick exploration of a fictional brand direction: first define the vibe (light, calm, restrained), then translate it into reusable typography and graphic rules—so the identity stays consistent across sizes and media.",
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
