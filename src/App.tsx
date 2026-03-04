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
      {/* 效果：整页加载时淡入，见 index.css .intro-fade-in */}
      {/* 左侧边栏：三块 */}
      <aside className="w-[30%] min-w-0 h-screen flex-shrink-0 overflow-hidden flex flex-col bg-[#ffffff]">
        {/* 第一块：网站名，高度 40 */}
        <div className="h-fit flex-shrink-0 flex items-center pl-6 pr-4 pt-6 pb-1">
          {/* 效果：加载时标题色带从左到右扫过，见 index.css .site-title-sweep */}
          <h1 className="site-title-sweep text-xl font-medium font-serif">leonardozi.fun</h1>
        </div>
        {/* 第二块：简介，填充剩余高度 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <p className="text-sm text-[rgba(162,157,150,1)] leading-relaxed">
            用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。
          </p>
        </div>
        {/* 第三块：网站信息，高度 30 */}
        <div className="h-[60px] flex-shrink-0 flex items-center px-6 text-xs text-[rgba(162,157,150,1)]">
          <span>© 2025</span>
          <span className="mx-2">·</span>
          <a href="#" className="hover:text-[rgba(162,157,150,1)]">关于</a>
          <span className="mx-2">·</span>
          <a href="#" className="hover:text-[rgba(162,157,150,1)]">联系</a>
        </div>
      </aside>
      {/* 右侧：瀑布流作品 */}
      <main className="w-[70%] min-w-0 flex-shrink-0 h-screen overflow-y-auto bg-[#ffffff]">
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
