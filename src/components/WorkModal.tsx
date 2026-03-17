import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "../data/works";

const SCROLL_DIRECTION_THRESHOLD = 8;

interface WorkModalProps {
  work: Work;
  origin?: { dx: number; dy: number };
  onClose: () => void;
}

/** 弹窗打开/关闭动画时长（ms） */
const DURATION_MS = 240;

export default function WorkModal({ work, origin, onClose }: WorkModalProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  // Lenis: smooth scroll inside modal (mobile + desktop).
  useEffect(() => {
    const LenisCtor = window.Lenis;
    const wrapper = scrollRef.current;
    const content = scrollContentRef.current;
    if (!LenisCtor || !wrapper || !content) return;

    const lenis = new LenisCtor({
      wrapper,
      content,
      smoothWheel: true,
      lerp: 0.08,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const y = el.scrollTop;
    const delta = y - lastScrollTop.current;
    if (Math.abs(delta) >= SCROLL_DIRECTION_THRESHOLD) {
      setHeaderOpacity(delta > 0 ? 0 : 1);
    }
    lastScrollTop.current = y;
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handler);
    setOpen(true);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => onClose(), DURATION_MS);
    return () => clearTimeout(t);
  }, [closing, onClose]);

  function requestClose() {
    if (closing) return;
    setClosing(true);
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) requestClose();
  }

  const initialTransform = origin
    ? `translate(${origin.dx}px, ${origin.dy}px) scale(0.6)`
    : "scale(0.9)";
  const finalTransform = "translate(0, 0) scale(1)";
  const visible = open && !closing;

  return (
    <>
      {/* 样式：手机端全屏白底，桌面端居中+毛玻璃+p-4；遮罩透明度 ↓ */}
      <div
        className="work-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-white p-0 md:backdrop-blur-[3px] md:p-4"
        style={{
          opacity: visible ? 1 : 0, // 弹窗显隐：开=1 关=0
          transition: `opacity ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1), backdrop-filter ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
        }}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label="作品详情"
      >
        {/* 样式：边框与圆角同层，手机端无圆角、桌面端 8px 圆角 */}
        <div
          className="work-modal-inner relative flex w-full h-full flex-col bg-white overflow-hidden border-[0.5px] border-[#e0e0e0] rounded-none md:rounded-lg md:w-[75vw] md:h-[95vh] md:max-w-[1100px]"
          style={{
            transform: visible ? finalTransform : initialTransform,
            opacity: visible ? 1 : 0.4, // 弹窗盒子透明度：开=1，关时过渡到 0.4（可改）
            transition: `transform ${DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 样式：可滚动内容区 .modal-scroll-hide 隐藏滚动条 */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto modal-scroll-hide"
            onScroll={handleScroll}
          >
            <div ref={scrollContentRef}>
              {/* 样式：header 吸顶、白底、px-6 py-6 min-h-[52px]；style 控制向下滚渐隐 */}
              <header
                className="sticky top-0 z-10 flex shrink-0 items-center justify-between px-6 py-6 min-h-[52px] bg-white"
                style={{
                  opacity: headerOpacity, // 向下滚动时 header 渐隐（0~1）
                  transition: "opacity 150ms cubic-bezier(0.33, 1, 0.68, 1)",
                }}
              >
                <h2 className="text-xl font-medium text-[rgba(38,37,31,1)]">{work.title}</h2>
                {/* 样式：关闭按钮 40×40 圆形、浅灰底、悬停加深 */}
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(162,157,150,0.12)] text-[rgba(162,157,150,1)] hover:bg-[rgba(162,157,150,0.2)]"
                  aria-label="关闭"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                    <path d="M4 4l10 10M14 4L4 14" />
                  </svg>
                </button>
              </header>
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {(work.detailImages ?? [work.image]).map((src, i) => (
                    /* 样式：弹窗内单图容器圆角 6px、浅灰底 */
                    <div key={i} className="rounded-[6px] overflow-hidden bg-[rgba(162,157,150,0.12)]">
                      <img
                        src={src}
                        alt={`${work.title} - ${i + 1}`}
                        className="w-full h-auto block object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[rgba(162,157,150,1)] leading-relaxed">
                  这里可以放作品说明，后续按需替换内容即可。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
