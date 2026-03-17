import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "../data/works";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const requestClose = useCallback(() => {
    setClosing((prev) => (prev ? prev : true));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handler);
    setOpen(true);
    return () => window.removeEventListener("keydown", handler);
  }, [requestClose]);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => onClose(), DURATION_MS);
    return () => clearTimeout(t);
  }, [closing, onClose]);

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
      {/* 全屏弹窗：遮罩透明度 ↓ */}
      <div
        className="work-modal-backdrop fixed inset-0 z-50 bg-white"
        style={{
          opacity: visible ? 1 : 0, // 弹窗显隐：开=1 关=0
          transition: `opacity ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1), backdrop-filter ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
        }}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label="作品详情"
      >
        {/* 全屏容器：始终铺满视口 */}
        <div
          className="work-modal-inner relative flex h-full w-full flex-col overflow-hidden bg-white"
          style={{
            transform: visible ? finalTransform : initialTransform,
            opacity: visible ? 1 : 0.4, // 弹窗盒子透明度：开=1，关时过渡到 0.4（可改）
            transition: `transform ${DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮：始终固定在右上角 */}
          <button
            type="button"
            onClick={requestClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(162,157,150,0.12)] text-[rgba(162,157,150,1)] hover:bg-[rgba(162,157,150,0.2)]"
            aria-label="关闭"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>

          {/* 样式：可滚动内容区 .modal-scroll-hide 隐藏滚动条 */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto modal-scroll-hide"
          >
            <div className="mx-auto w-full max-w-[1028px]">
              <div className="p-6 pt-16">
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
