/** 样式相关：full 卡片占两列、图片 3:2 长方形；half 占一列、图片 1:1 正方形 */
export type WorkLayout = "full" | "half";

export interface Work {
  id: string;
  title: string;
  image: string;   // 卡片缩略图，相对于 public
  detailImages?: string[]; // 弹窗内多图，不填则用 [image]
  tags: string[];
  date: string;
  layout: WorkLayout;
}

/** works 文件夹下的 webp，顺序固定：最上面作品用 2.webp，其余按此顺序轮询 */
const WORKS_WEBP = [
  "./works/2.webp",
  "./works/1.WEBP",
  "./works/3.webp",
  "./works/4.webp",
  "./works/5.webp",
];

const worksBase: Omit<Work, "image" | "detailImages">[] = [
  { id: "1", title: "山雨初晴", tags: ["界面", "原型"], date: "2025/03/01", layout: "full" },
  { id: "2", title: "云栖谷口", tags: ["品牌", "视觉"], date: "2025/02/01", layout: "half" },
  { id: "3", title: "江畔晚照", tags: ["网页"], date: "2025/01/01", layout: "half" },
  { id: "4", title: "远山疏林", tags: ["网页"], date: "2025/01/01", layout: "half" },
  { id: "5", title: "溪桥烟树", tags: ["网页"], date: "2025/01/01", layout: "half" },
  { id: "6", title: "松风听泉", tags: ["界面", "原型"], date: "2025/03/01", layout: "full" },
];

export const works: Work[] = worksBase.map((w, i) => {
  const image = WORKS_WEBP[i % WORKS_WEBP.length];
  const detailImages = [
    WORKS_WEBP[i % WORKS_WEBP.length],
    WORKS_WEBP[(i + 1) % WORKS_WEBP.length],
    WORKS_WEBP[(i + 2) % WORKS_WEBP.length],
  ];
  return { ...w, image, detailImages };
});
