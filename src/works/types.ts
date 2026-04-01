export type WorkLayout = "full" | "half";

export type WorkDetailMedia = { type: "image" | "video"; src: string };

export type WorkCardCoverBackground =
  | { type: "color"; color: string }
  | { type: "image"; src: string }
  | {
      type: "video";
      src: string;
      loop?: boolean;
      muted?: boolean;
      playsInline?: boolean;
      autoPlay?: boolean;
      controls?: boolean;
      preload?: "none" | "metadata" | "auto";
      poster?: string;
    }
  | {
      type: "reactbits";
      effect: "aurora" | "darkVeil";
      params?: Record<string, number | string | boolean | undefined>;
      fallbackColor?: string;
    };

export type WorkCardCoverAnchor = {
  /** 以元素尺寸为基准：x=0 为左边，y=1 为底边 */
  x: number;
  y: number;
};

export type WorkCardCoverForegroundPlacement =
  | { mode: "center" }
  | { mode: "centerRatio"; widthRatio: number }
  | { mode: "centerFixedWidth"; widthPx: number }
  | {
      mode: "anchorPosition";
      /** 坐标系：x 为 [-20, 20]，y 为 [-10, 10] */
      coordinate: { x: number; y: number };
      anchor: WorkCardCoverAnchor;
      /** 可选尺寸：不填时用内容天然尺寸 */
      widthRatio?: number;
      widthPx?: number;
    };

export type WorkCardCoverForeground =
  | {
      type: "image";
      src: string;
      placement: WorkCardCoverForegroundPlacement;
      preserveAspectRatio?: boolean;
    }
  | {
      type: "video";
      src: string;
      placement: WorkCardCoverForegroundPlacement;
      playbackRate?: number;
      loop?: boolean;
      muted?: boolean;
      playsInline?: boolean;
      autoPlay?: boolean;
      controls?: boolean;
      preload?: "none" | "metadata" | "auto";
    }
  | {
      type: "stack";
      placement: WorkCardCoverForegroundPlacement;
      gapPx: number;
      /** 将内容按 placement.widthRatio 相对基准比例缩放（仅 centerRatio 生效） */
      scaleWithPlacement?: { baseWidthRatio: number };
      items: Array<
        | {
            type: "image";
            src: string;
            widthPx?: number;
            widthRatio?: number;
            preserveAspectRatio?: boolean;
          }
        | {
            type: "text";
            text: string;
            fontSizePx: number;
            fontWeight: number;
            color?: string;
          }
      >;
    };

export interface WorkCardCover {
  background: WorkCardCoverBackground;
  foreground?: WorkCardCoverForeground;
}

export interface Work {
  id: string;
  title: string;
  image: string; // 卡片缩略图（相对于 public）
  /** 卡片主图固定高度（px），不填默认 581 */
  cardImageHeightPx?: number;
  /** 卡片主图宽高比（width / height），优先于固定高度 */
  cardImageAspectRatio?: number;
  /** 新版封面协议（优先于 image + overlayIcon） */
  cardCover?: WorkCardCover;
  detailImages?: string[]; // 弹窗内图片列表，不填则用 [image]
  /** 详情媒体（支持图片/视频混排），优先于 detailImages */
  detailMedia?: WorkDetailMedia[];
  /** 卡片叠加图标（可选，用于“背景图 + icon”样式） */
  overlayIcon?: string;
  tags: string[];
  /** English version of tags (optional) */
  tagsEn?: string[];
  date: string;
  /** WorkCard 第二行简介（可选，不填会回退到 typeLabel/overview） */
  cardIntro?: string;
  /** English version of cardIntro (optional) */
  cardIntroEn?: string;
  /** 弹窗顶部信息（可选） */
  typeLabel?: string;
  /** English version of typeLabel (optional) */
  typeLabelEn?: string;
  details?: Array<{ label: string; value: string }>;
  /** English version of details (optional) */
  detailsEn?: Array<{ label: string; value: string }>;
  overview?: string;
  /** English version of overview (optional) */
  overviewEn?: string;
  layout: WorkLayout;
}
