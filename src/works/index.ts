import type { Work } from "./types";
import { work01Poppy } from "./work-01-poppy";
import { work02 } from "./work-02";
import { work03 } from "./work-03";
import { work04 } from "./work-04";
import { work05 } from "./work-05";
import { work06 } from "./work-06";

const WORKS_WEBP_FALLBACK = ["./works/2.webp", "./works/1.WEBP", "./works/3.webp", "./works/4.webp", "./works/5.webp"];

export const works: Work[] = [work01Poppy, work02, work03, work04, work05, work06].map((w, i) => {
  const defaultImage = WORKS_WEBP_FALLBACK[i % WORKS_WEBP_FALLBACK.length];
  const defaultDetailImages = [
    WORKS_WEBP_FALLBACK[i % WORKS_WEBP_FALLBACK.length],
    WORKS_WEBP_FALLBACK[(i + 1) % WORKS_WEBP_FALLBACK.length],
    WORKS_WEBP_FALLBACK[(i + 2) % WORKS_WEBP_FALLBACK.length],
  ];
  return {
    ...w,
    image: w.image ?? defaultImage,
    detailImages: w.detailImages ?? defaultDetailImages,
  };
});

