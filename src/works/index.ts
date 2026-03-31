import type { Work } from "./types";
import { work01Poppy } from "./work-01-poppy";
import { work02 } from "./work-02";
import { work03 } from "./work-03";
import { work04 } from "./work-04";
import { work05 } from "./work-05";

/** 弹窗多图 / 未单独配置封面时的占位（均在 public/works/bg） */
const BG_PLACEHOLDER_IMAGES = [
  "./works/bg/苏崇铭1.webp",
  "./works/bg/苏崇铭2.webp",
  "./works/bg/苏崇铭3.webp",
  "./works/bg/苏崇铭4.webp",
  "./works/bg/苏崇铭5.webp",
  "./works/bg/苏崇铭6.webp",
  "./works/bg/苏崇铭7.webp",
  "./works/bg/苏崇铭8.webp",
  "./works/bg/苏崇铭9.webp",
  "./works/bg/苏崇铭10.webp",
];

// 交换 Bob Music / Wisdom Horse 的“内容与链接”，并保持各自原始卡片尺寸（cardImageHeightPx）
// 例如：Bob Music 在 `work-03.ts` 里配置为 350px，这里不应被 swap 成 650px
const work03Swapped: Work = { ...work03 };
const work05Swapped: Work = { ...work05 };

export const works: Work[] = [work01Poppy, work02, work05Swapped, work04, work03Swapped].map((w, i) => {
  const defaultImage = BG_PLACEHOLDER_IMAGES[i % BG_PLACEHOLDER_IMAGES.length];
  const defaultDetailImages = [
    BG_PLACEHOLDER_IMAGES[i % BG_PLACEHOLDER_IMAGES.length],
    BG_PLACEHOLDER_IMAGES[(i + 1) % BG_PLACEHOLDER_IMAGES.length],
    BG_PLACEHOLDER_IMAGES[(i + 2) % BG_PLACEHOLDER_IMAGES.length],
  ];
  return {
    ...w,
    image: w.image ?? defaultImage,
    detailImages: w.detailImages ?? defaultDetailImages,
  };
});

