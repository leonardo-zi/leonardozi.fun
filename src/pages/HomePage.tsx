import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import WorkCard from "../components/WorkCard";
import WorkModal from "../components/WorkModal";
import { works } from "../works";
import type { Work } from "../works/types";

interface ModalOrigin {
  dx: number;
  dy: number;
}

const CURRENT_YEAR = new Date().getFullYear();

function Copyright({ year = CURRENT_YEAR }: { year?: number }) {
  return <span>© {year} · Vibe Coding by Cursor</span>;
}

/** 移动端全屏侧栏：点击顶部菜单后显示 */
function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col bg-[#ffffff]">
      <div className="flex shrink-0 items-center justify-between px-4 py-4">
        <h1 className="site-title-sweep text-xl font-medium font-serif">leonardozi.fun</h1>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[rgba(162,157,150,1)] hover:bg-[rgba(162,157,150,0.2)]"
          aria-label="关闭"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="M4 4l10 10M14 4L4 14" />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        <p className="text-sm text-[rgba(162,157,150,1)] leading-relaxed">
          用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。
        </p>
      </div>
    </div>
  );
}

const SCROLL_THRESHOLD = 8;
const SIDEBAR_DURATION_MS = 240;

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [sidebarJustOpened, setSidebarJustOpened] = useState(false);
  const [mobileHeaderOpacity, setMobileHeaderOpacity] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const requestCloseSidebar = useCallback(() => {
    if (sidebarClosing) return;
    setSidebarClosing(true);
  }, [sidebarClosing]);

  useEffect(() => {
    if (!sidebarOpen || !sidebarJustOpened) return;
    const id = requestAnimationFrame(() => setSidebarJustOpened(false));
    return () => cancelAnimationFrame(id);
  }, [sidebarOpen, sidebarJustOpened]);

  useEffect(() => {
    if (!sidebarClosing) return;
    const t = setTimeout(() => {
      setSidebarOpen(false);
      setSidebarClosing(false);
    }, SIDEBAR_DURATION_MS);
    return () => clearTimeout(t);
  }, [sidebarClosing]);

  const handleOpen = useCallback((work: Work, origin: { x: number; y: number }) => {
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    setModalOrigin({
      dx: origin.x - viewportCenterX,
      dy: origin.y - viewportCenterY,
    });
    setSelectedWork(work);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedWork(null);
    setModalOrigin(null);
  }, []);

  const onMobileScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const y = el.scrollTop;
    const delta = y - lastScrollTop.current;
    if (Math.abs(delta) >= SCROLL_THRESHOLD) {
      setMobileHeaderOpacity(delta > 0 ? 0 : 1);
    }
    lastScrollTop.current = y;
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.addEventListener("scroll", onMobileScroll, { passive: true });
    return () => el.removeEventListener("scroll", onMobileScroll);
  }, [onMobileScroll]);

  return (
    <div className="intro-fade-in flex h-screen flex-col overflow-hidden md:flex-row">
      {/* 移动端：顶部栏 = 菜单按钮 + 标题，滚动时消失；仅 < 768px */}
      <header
        className="sidebar-top-bar fixed left-0 right-0 top-0 z-40 flex shrink-0 items-center justify-between bg-white px-4 py-4 md:hidden"
        style={{
          opacity: mobileHeaderOpacity,
          transition: "opacity 150ms cubic-bezier(0.33, 1, 0.68, 1)",
        }}
      >
        <h1 className="site-title-sweep text-xl font-medium font-serif">leonardozi.fun</h1>
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(true);
            setSidebarClosing(false);
            setSidebarJustOpened(true);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-[6px] text-[rgba(162,157,150,1)] hover:bg-[rgba(162,157,150,0.2)]"
          aria-label="打开菜单"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </header>

      {/* 移动端：全屏侧栏遮罩，打开/关闭带 240ms 淡入淡出 */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="菜单"
          style={{
            opacity: sidebarJustOpened || sidebarClosing ? 0 : 1,
            transition: `opacity ${SIDEBAR_DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
          }}
        >
          <div className="absolute inset-0 bg-white" onClick={requestCloseSidebar} aria-hidden />
          <div className="absolute inset-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <SidebarContent onClose={requestCloseSidebar} />
          </div>
        </div>
      )}

      {/* 桌面端：左侧边栏，仅 ≥ 768px 显示 */}
      <aside className="hidden w-[30%] min-w-0 shrink-0 flex-col overflow-hidden bg-[#ffffff] md:flex md:h-screen">
        <div className="h-fit shrink-0 flex items-center pl-6 pr-4 pt-6 pb-1">
          <h1 className="site-title-sweep text-xl font-medium font-serif">leonardozi.fun</h1>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <p className="text-sm text-[rgba(162,157,150,1)] leading-relaxed">
            用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。
          </p>
        </div>
        <div className="h-[60px] shrink-0 flex items-center px-6 text-xs text-[rgba(162,157,150,1)]">
          <Copyright />
        </div>
      </aside>

      {/* 主区：移动端仅作品单列 + 底部页脚，桌面端仅作品两列；侧栏内容仅通过顶部菜单打开 */}
      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto bg-[#ffffff] md:w-[70%] md:shrink-0 md:h-screen">
        {/* 作品区：移动端统一单列并预留顶栏高度，桌面端两列且保留 full 占两列 */}
        <motion.div
          className="w-full p-4 pt-24 grid grid-cols-1 gap-6 md:p-6 md:pt-6 md:grid-cols-2 md:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: reduceMotion
                ? { staggerChildren: 0, delayChildren: 0 }
                : {
                    /** 放慢节奏：保证每一张都能被清楚看到再出现下一张 */
                    delayChildren: 0.55,
                    staggerChildren: 0.62,
                  },
            },
          }}
        >
          {works.map((work, i) => (
            <WorkCard key={work.id} work={work} onClick={handleOpen} isFirst={i === 0} />
          ))}
        </motion.div>
        {/* 移动端：页脚放在页面最底部，仅 < 768px 显示 */}
        <div className="flex items-center justify-center px-4 py-6 text-xs text-[rgba(162,157,150,1)] md:hidden">
          <Copyright />
        </div>
      </main>

      {selectedWork && <WorkModal work={selectedWork} origin={modalOrigin ?? undefined} onClose={handleClose} />}
    </div>
  );
}

