import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "../works/types";

interface WorkModalProps {
  work: Work;
  origin?: { dx: number; dy: number };
  onClose: () => void;
  lang: "cn" | "en";
}

/** 弹窗打开/关闭动画时长（ms） */
const DURATION_MS = 360;

export default function WorkModal({ work, onClose, lang }: WorkModalProps) {
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

  // 改成全屏遮罩的淡入淡出：不再根据点击位置做“从卡片弹出”平移/缩放
  const initialTransform = "scale(0.98)";
  const finalTransform = "scale(1)";
  const visible = open && !closing;
  const details = (lang === "en" ? work.detailsEn ?? work.details : work.details) ?? [];
  const overview = lang === "en" ? work.overviewEn ?? work.overview : work.overview;
  const hasTopCopy = Boolean(work.title || overview || details.length > 0);

  return (
    <>
      {/* 全屏弹窗：遮罩透明度 ↓ */}
      <div
        className="work-modal-backdrop fixed inset-0 z-50 bg-white"
        style={{
          // 让背景在遮罩中“看得见但更虚”：白色遮罩 + backdrop blur
          opacity: visible ? 1 : 0,
          backgroundColor: "rgba(255, 255, 255, 0.86)",
          backdropFilter: visible ? "blur(10px)" : "blur(0px)",
          transition: `opacity ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1), backdrop-filter ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1), background-color ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
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
            opacity: visible ? 1 : 0,
            transition: `transform ${DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮：始终固定在右上角 */}
          <button
            type="button"
            onClick={requestClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(162,157,150,0.12)] text-[rgba(162,157,150,1)] hover:bg-[rgba(162,157,150,0.2)]"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
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
            <div className="mx-auto w-full max-w-[700px]">
              <div className="px-0 pt-16 pb-6 md:px-0">
                {hasTopCopy && (
                  <div className="pb-[22px]">
                    <h2 className="text-[28px] leading-[1.15] font-medium font-ui-sans-cn text-[rgba(38,37,31,1)] md:text-[44px]">
                      {work.title}
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
                      {details.length > 0 && (
                        <section>
                          <dl className="space-y-2 text-sm text-[rgba(38,37,31,0.78)]">
                            {details.map((item) => (
                              <div key={`${item.label}-${item.value}`} className="grid grid-cols-[96px_1fr] gap-4">
                                <dt className="font-medium text-[rgba(38,37,31,0.62)]">{item.label}:</dt>
                                <dd className="min-w-0">{item.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      )}

                      {(overview || work.title) && (
                        <section>
                          <p className="text-sm leading-relaxed text-[rgba(38,37,31,0.78)]">
                            {overview ?? "You can place a project description here and update it as needed."}
                          </p>
                        </section>
                      )}
                    </div>
                  </div>
                )}

                {hasTopCopy && <div className="my-[100px] border-b-[0.5px] border-[#e0e0e0]" aria-hidden />}

                <div className="flex flex-col gap-4">
                  {(work.detailImages ?? [work.image]).map((src, i) => (
                    <div key={i} className="rounded-[4px] overflow-hidden bg-[rgba(162,157,150,0.12)]">
                      <img
                        src={src}
                        alt={`${work.title} - ${i + 1}`}
                        className="w-full h-auto block object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="my-[100px] border-b-[0.5px] border-[#e0e0e0]" aria-hidden />
                <div className="h-[60px]" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
