import { useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
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
                className="inline-flex h-fit items-center gap-2 rounded-full bg-transparent px-0 pr-[40px] text-[12px] text-[rgba(38,37,31,1)]"
              >
                <Icon icon="material-symbols-light:arrow-left-alt-rounded" width={16} height={16} aria-hidden />
                {lang === "en" ? "Back to home" : "返回主页"}
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
                  className="inline-flex h-fit items-center gap-2 rounded-full bg-transparent px-0 pr-[40px] text-[12px] text-[rgba(38,37,31,1)]"
                >
                  <Icon icon="material-symbols-light:arrow-left-alt-rounded" width={16} height={16} aria-hidden />
                  {lang === "en" ? "Back to home" : "返回主页"}
                </button>
              </div>

              {/* 主页/作品：仅桌面端显示 */}
              <div className="hidden min-[1020px]:flex h-fit pt-[76px] items-center">
                <div className="text-[12px] text-[rgba(38,37,31,0.62)]">
                  {lang === "en" ? "Home" : "主页"} / {work.title}
                </div>
              </div>

              {hasTopCopy && (
                <div className="pt-8 pb-6 min-[801px]:pb-8">
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
                {(work.detailImages ?? [work.image]).map((src, i) => (
                  <div key={i} className="rounded-[4px] overflow-hidden bg-[rgba(162,157,150,0.12)]">
                    <ModalLazyImage
                      src={src}
                      alt={`${work.title} - ${i + 1}`}
                      eager={i < EAGER_IMAGES_COUNT}
                      scrollRoot={scrollRef as React.RefObject<HTMLElement | null>}
                      placeholderMinHeight={240}
                    />
                  </div>
                ))}
              </div>

              <div className="my-16 min-[801px]:my-[100px] border-b-[0.5px] border-[#e0e0e0]" aria-hidden />
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

