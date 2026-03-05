import { useState } from "react";
import WorkCard from "./components/WorkCard";
import WorkModal from "./components/WorkModal";
import { works } from "./data/works";
import type { Work } from "./data/works";

interface ModalOrigin {
  dx: number;
  dy: number;
}

function App() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin | null>(null);

  function handleOpen(work: Work, origin: { x: number; y: number }) {
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    setModalOrigin({
      dx: origin.x - viewportCenterX,
      dy: origin.y - viewportCenterY,
    });
    setSelectedWork(work);
  }

  function handleClose() {
    setSelectedWork(null);
    setModalOrigin(null);
  }

  return (
    <div className="intro-fade-in flex h-screen overflow-hidden">
      {/* 样式：整页淡入 .intro-fade-in，flex 满屏、隐藏溢出 */}
      {/* 样式：左侧边栏宽 30%、满高、白底、三块纵向排列 */}
      <aside className="w-[30%] min-w-0 h-screen flex-shrink-0 overflow-hidden flex flex-col bg-[#ffffff]">
        {/* 样式：第一块网站名，内边距 pl-6 pr-4 pt-6 pb-1 */}
        <div className="h-fit flex-shrink-0 flex items-center pl-6 pr-4 pt-6 pb-1">
          {/* 样式：标题扫光动画 .site-title-sweep，字号 xl、serif */}
          <h1 className="site-title-sweep text-xl font-medium font-serif">leonardozi.fun</h1>
        </div>
        {/* 样式：第二块简介区，占满剩余高度、可滚动、px-6 py-4 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <p className="text-sm text-[rgba(162,157,150,1)] leading-relaxed">
            用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。
          </p>
        </div>
        {/* 样式：第三块页脚，固定高 60px、小字号、灰色 */}
        <div className="h-[60px] flex-shrink-0 flex items-center px-6 text-xs text-[rgba(162,157,150,1)]">
          <span>© 2025</span>
          <span className="mx-2">·</span>
          <a href="#" className="hover:text-[rgba(162,157,150,1)]">关于</a>
          <span className="mx-2">·</span>
          <a href="#" className="hover:text-[rgba(162,157,150,1)]">联系</a>
        </div>
      </aside>
      {/* 样式：右侧主区宽 70%、满高、可滚动、白底 */}
      <main className="w-[70%] min-w-0 flex-shrink-0 h-screen overflow-y-auto bg-[#ffffff]">
        {/* 样式：作品网格 2 列、间距 gap-6、内边距 p-6 */}
        <div className="p-6 grid grid-cols-2 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} onClick={handleOpen} />
          ))}
        </div>
      </main>
      {selectedWork && (
        <WorkModal
          work={selectedWork}
          origin={modalOrigin ?? undefined}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;
