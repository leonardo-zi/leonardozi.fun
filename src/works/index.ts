import type { Work } from "./types";
import { work00Tenet } from "./work-00-tenet";
import { work01Poppy } from "./work-01-poppy";
import { work02 } from "./work-02";
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

export const works: Work[] = [work00Tenet, work01Poppy, work02, work05, work04].map((w, i) => {
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

