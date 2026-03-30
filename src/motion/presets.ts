import type { Variants } from "framer-motion";

/** 路由级页面容器（由 PageTransition 使用） */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
};

export const pageTransitionReducedVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

/** 与 `worksStaggerContainer` 子项 delay 对齐，供宽屏双列用 custom 索引手写 stagger */
export const WORKS_STAGGER_TIMING = {
  delayChildren: 0.04,
  staggerChildren: 0.055,
} as const;

/** 作品列表 stagger（WorksPage 单列）；hidden 时整组不展示，等预加载后再播 stagger */
export const worksStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: WORKS_STAGGER_TIMING.staggerChildren,
      delayChildren: WORKS_STAGGER_TIMING.delayChildren,
    },
  },
};

/** 宽屏双列：外层只做整体淡入；子项用 `custom` + 行优先索引延迟，避免 grid 同行强制等高留白 */
export const worksStaggerContainerWide: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
};

export const worksStaggerItem: Variants = {
  hidden: { opacity: 0, y: 72 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
};

/** 略轻量级项（移动端/低功率可由页面层选用，此处保留单一 profile） */
export const worksStaggerItemMobile: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
  },
};

/** 音乐网格轻 stagger（行优先 DOM 与 grid 一致；hidden 与 PageTransition 衔接，避免子项先闪） */
export const musicStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
};

export const musicStaggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

/** 音乐网格：减少动态效果 */
export const musicStaggerItemReduced: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0 } },
};

export const musicStaggerContainerReduced: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0, delayChildren: 0 } },
};
