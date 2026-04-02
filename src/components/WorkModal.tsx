import { useEffect, useMemo, useRef } from "react";
import type { Work } from "../works/types";
import ModalLazyImage from "./ModalLazyImage";
import { publicAssetUrl } from "../utils/publicAssetUrl";

interface WorkModalProps {
  work: Work;
  origin?: { dx: number; dy: number };
  onClose: () => void;
  lang: "cn" | "en";
}

const EAGER_IMAGES_COUNT = 1;

export default function WorkModal({ work, onClose, lang }: WorkModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const detailMediaBorderRadiusPx = work.id === "0" ? 16 : 4;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  const details = useMemo(() => (lang === "en" ? work.detailsEn ?? work.details : work.details) ?? [], [lang, work.details, work.detailsEn]);
  const overview = useMemo(() => (lang === "en" ? work.overviewEn ?? work.overview : work.overview), [lang, work.overview, work.overviewEn]);
  const hasTopCopy = Boolean(work.title || overview || details.length > 0);

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.92)",
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="作品详情"
    >
      <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(162,157,150,0.12)] text-[rgba(162,157,150,1)]"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
          aria-label="关闭"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="M4 4l10 10M14 4L4 14" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="h-full w-full overflow-y-auto modal-scroll-hide"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="mx-auto w-full max-w-[700px] px-6 sm:px-8 md:px-0">
            <div
              className="pb-8 min-[801px]:pb-10"
              style={{
                paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)",
              }}
            >
              {hasTopCopy && (
                <div className="pb-6 min-[801px]:pb-8">
                  <h2 className="text-[28px] leading-[1.15] font-medium font-ui-sans-cn text-[rgba(38,37,31,1)] min-[801px]:text-[44px]">
                    {work.title}
                  </h2>

                  <div className="mt-8 grid grid-cols-1 gap-10 min-[801px]:mt-10 min-[801px]:grid-cols-2">
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

              {hasTopCopy && <div className="my-16 min-[801px]:my-[100px] border-b-[0.5px] border-[#e0e0e0]" aria-hidden />}

              <div className="flex flex-col gap-4">
                {(work.detailMedia ?? (work.detailImages ?? [work.image]).map((src) => ({ type: "image" as const, src }))).map(
                  (media, i) => {
                    const resolvedSrc = publicAssetUrl(media.src);
                    if (media.type === "video") {
                      return (
                        <div
                          key={i}
                          className="overflow-hidden bg-transparent border-[0.5px] border-[#E6E6E6]"
                          style={{ borderRadius: detailMediaBorderRadiusPx }}
                        >
                          <video
                            src={resolvedSrc}
                            className="block w-full h-auto object-cover"
                            autoPlay
                            muted
                            playsInline
                            loop
                            controls={false}
                            preload="metadata"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        className="overflow-hidden bg-transparent border-[0.5px] border-[#E6E6E6]"
                        style={{ borderRadius: detailMediaBorderRadiusPx }}
                      >
                        <ModalLazyImage
                          src={resolvedSrc}
                          alt={`${work.title} - ${i + 1}`}
                          eager={i < EAGER_IMAGES_COUNT}
                          scrollRoot={scrollRef as React.RefObject<HTMLElement | null>}
                          placeholderMinHeight={240}
                        />
                      </div>
                    );
                  }
                )}
              </div>
              <div className="my-16 min-[801px]:my-[100px] border-b-[0.5px] border-[#e0e0e0]" aria-hidden />
              <div className="h-[60px]" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
