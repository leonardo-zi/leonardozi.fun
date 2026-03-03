export type WorkLayout = "full" | "half"; // full=占一行, half=每行两个

export interface Work {
  id: string;
  title: string;
  image: string;   // 相对于 public，如 /works/1.jpg
  tags: string[];
  date: string;    // 如 2025-01
  layout: WorkLayout;
}

export const works: Work[] = [
  { id: "1", title: "山雨初晴", image: "/works/1.png", tags: ["界面", "原型"], date: "2025/03/01", layout: "full" },
  { id: "2", title: "云栖谷口", image: "/works/2.png", tags: ["品牌", "视觉"], date: "2025/02/01", layout: "half" },
  { id: "3", title: "江畔晚照", image: "/works/2.png", tags: ["网页"], date: "2025/01/01", layout: "half" },
  { id: "4", title: "远山疏林", image: "/works/2.png", tags: ["网页"], date: "2025/01/01", layout: "half" },
  { id: "5", title: "溪桥烟树", image: "/works/2.png", tags: ["网页"], date: "2025/01/01", layout: "half" },
  { id: "6", title: "松风听泉", image: "/works/1.png", tags: ["界面", "原型"], date: "2025/03/01", layout: "full" },

];
