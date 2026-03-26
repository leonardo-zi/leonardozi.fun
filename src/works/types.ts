export type WorkLayout = "full" | "half";

export interface Work {
  id: string;
  title: string;
  image: string; // 卡片缩略图（相对于 public）
  /** 卡片主图固定高度（px），不填默认 509 */
  cardImageHeightPx?: number;
  detailImages?: string[]; // 弹窗内图片列表，不填则用 [image]
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

