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
  const lastScrollTop = useRef(0);

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
      {/* 效果：打开时背景+毛玻璃淡入，关闭时淡出 */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-[3px] p-4"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${DURATION_MS}ms ease-out, backdrop-filter ${DURATION_MS}ms ease-out`,
        }}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label="作品详情"
      >
        {/* 效果：打开时从点击位置 scale(0.6) 位移+缩放到居中，关闭时反向 */}
        <div
          className="modal-container relative flex w-[75vw] h-[95vh] flex-col bg-white shadow-xl overflow-hidden"
          style={{
            transform: visible ? finalTransform : initialTransform,
            opacity: visible ? 1 : 0.4,
            transition: `transform ${DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity ${DURATION_MS}ms ease-out`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto modal-scroll-hide"
            onScroll={handleScroll}
          >
            {/* 效果：向下滚动时 header 渐隐，向上滚动时渐显 */}
            <header
              className="sticky top-0 z-10 flex shrink-0 items-center justify-between px-6 py-6 min-h-[52px] bg-white"
              style={{
                opacity: headerOpacity,
                transition: "opacity 150ms ease-out",
              }}
            >
              <h2 className="text-xl font-medium text-[rgba(38,37,31,1)]">{work.title}</h2>
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
    </>
  );
}
