import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatedContent } from "reactbits-animation";
import type { Work } from "../works/types";
import ModalLazyImage from "../components/ModalLazyImage";

const EAGER_IMAGES_COUNT = 1;

export default function WorkDetailPage({
  work,
  lang,
  onBack,
}: {
  work: Work;
  lang: "cn" | "en";
  onBack: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const isLikelySafari = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Android/i.test(ua);
  }, []);

  const isMobileViewport = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(max-width: 800px)").matches;
  }, []);

  useEffect(() => {
    // 进入详情页时滚动到顶部，保持“页面切换”直觉
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [work.id]);

  const details = useMemo(
    () => (lang === "en" ? work.detailsEn ?? work.details : work.details) ?? [],
    [lang, work.details, work.detailsEn]
  );
  const overview = useMemo(
    () => (lang === "en" ? work.overviewEn ?? work.overview : work.overview),
    [lang, work.overview, work.overviewEn]
  );
  const hasTopCopy = Boolean(work.title || overview || details.length > 0);

  return (
    <div className="min-h-screen w-full bg-[#ffffff]">
      <div
        ref={scrollRef}
        className="w-full"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="mx-auto w-full max-w-[1760px] px-6">
          {/* >=1020px：三栏（左右同宽），<1020px：视作手机布局 */}
          <div className="pt-0 pb-10 min-[1020px]:grid min-[1020px]:grid-cols-[minmax(160px,1fr)_700px_minmax(160px,1fr)]">
            {/* 左栏：返回主页（桌面端，置顶随滚动） */}
            <div
              className="hidden min-[1020px]:flex h-fit pt-[76px] items-center sticky z-10"
              style={{ top: "env(safe-area-inset-top, 0px)" }}
            >
              <button
                type="button"
                onClick={onBack}
                className="group inline-flex h-fit items-center gap-2 rounded-full bg-transparent px-0 pr-[40px] text-[11px] text-[rgba(38,37,31,1)] cursor-pointer hover:opacity-80 active:opacity-60"
              >
                <Icon icon="material-symbols-light:arrow-left-alt-rounded" width={14} height={14} aria-hidden />
                <span className="relative inline-block">
                  {lang === "en" ? "Back to home" : "返回主页"}
                  <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[rgba(38,37,31,1)] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                </span>
              </button>
            </div>

            {/* 中栏：内容（固定 700px） */}
            <div className="min-w-0">
              {/* 返回按钮：手机视图 */}
              <div
                className="flex h-[76px] items-center mb-[100px] min-[1020px]:hidden"
                style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
              >
                <button
                  type="button"
                  onClick={onBack}
                  className="group inline-flex h-fit items-center gap-2 rounded-full bg-transparent px-0 pr-[40px] text-[11px] text-[rgba(38,37,31,1)] cursor-pointer hover:opacity-80 active:opacity-60"
                >
                  <Icon icon="material-symbols-light:arrow-left-alt-rounded" width={14} height={14} aria-hidden />
                  <span className="relative inline-block">
                    {lang === "en" ? "Back to home" : "返回主页"}
                    <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[rgba(38,37,31,1)] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                  </span>
                </button>
              </div>

              {/* 主页/作品：仅桌面端显示 */}
              <div className="hidden min-[1020px]:flex h-fit pt-[76px] items-center">
                <div className="text-[11px] text-[#aaaaaa]">
                  <button
                    type="button"
                    onClick={onBack}
                    className="group relative inline-flex items-center text-[11px] text-[#aaaaaa] cursor-pointer transition-colors duration-150 hover:text-[#000000] active:opacity-60"
                  >
                    {lang === "en" ? "Home" : "主页"}
                    <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                  </button>
                  {" / "}
                  <span>{work.title}</span>
                </div>
              </div>

              {hasTopCopy && (
                <div className="pt-8 pb-6 min-[801px]:pb-8">
                  <h2 className="text-[24px] leading-[1.15] font-medium font-ui-sans-cn text-[rgba(38,37,31,1)]">
                    {work.title}
                  </h2>

                  <div className="mt-8 grid grid-cols-1 gap-10 min-[801px]:mt-10 min-[801px]:grid-cols-2">
                    {details.length > 0 && (
                      <section>
                        <dl className="space-y-2 text-[11px] text-[#000000]">
                          {details.map((item) => (
                            <div key={`${item.label}-${item.value}`} className="grid grid-cols-[96px_1fr] gap-4">
                              <dt className="font-medium text-[#aaaaaa]">{item.label}:</dt>
                              <dd className="min-w-0 text-[#000000]">{item.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    )}

                    {(overview || work.title) && (
                      <section>
                        <p className="text-[11px] leading-relaxed text-[#000000]">
                          {overview ?? "You can place a project description here and update it as needed."}
                        </p>
                      </section>
                    )}
                  </div>
                </div>
              )}

              {hasTopCopy && <div className="my-16 min-[801px]:my-[100px]" aria-hidden />}

              <div className="flex flex-col gap-4">
                {(work.detailImages ?? [work.image]).map((src, i) => {
                  const useLightProfile = isMobileViewport || isLikelySafari;
                  const imageBlock = (
                    <div className="rounded-[4px] overflow-hidden bg-[rgba(162,157,150,0.12)]">
                      <ModalLazyImage
                        src={src}
                        alt={`${work.title} - ${i + 1}`}
                        eager={i < EAGER_IMAGES_COUNT}
                        scrollRoot={scrollRef as React.RefObject<HTMLElement | null>}
                        placeholderMinHeight={240}
                      />
                    </div>
                  );

                  if (reducedMotion) {
                    return <div key={i}>{imageBlock}</div>;
                  }

                  return (
                    <AnimatedContent
                      key={i}
                      distance={useLightProfile ? 70 : 92}
                      direction="vertical"
                      duration={useLightProfile ? 0.8 : 0.95}
                      ease="power3.out"
                      initialOpacity={0.1}
                      animateOpacity
                      threshold={useLightProfile ? 0.08 : 0.05}
                      delay={Math.min(i, 10) * (useLightProfile ? 0.12 : 0.16)}
                    >
                      {imageBlock}
                    </AnimatedContent>
                  );
                })}
              </div>

              <div className="my-16 min-[801px]:my-[100px]" aria-hidden />
              <div className="h-[60px]" aria-hidden />
            </div>

            {/* 右栏：占位，保持与左栏同宽 */}
            <div className="hidden min-[1020px]:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

