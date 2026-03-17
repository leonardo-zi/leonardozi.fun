export type WorkLayout = "full" | "half";

export interface Work {
  id: string;
  title: string;
  image: string; // 卡片缩略图（相对于 public）
  detailImages?: string[]; // 弹窗内图片列表，不填则用 [image]
  /** 卡片叠加图标（可选，用于“背景图 + icon”样式） */
  overlayIcon?: string;
  tags: string[];
  date: string;
  /** 弹窗顶部信息（可选） */
  typeLabel?: string;
  details?: Array<{ label: string; value: string }>;
  overview?: string;
  layout: WorkLayout;
}

