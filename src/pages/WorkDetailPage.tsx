import { useLayoutEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import type { Work } from "../works/types";
import ModalLazyImage from "../components/ModalLazyImage";
import { publicAssetUrl } from "../utils/publicAssetUrl";

export default function WorkDetailPage({
  work,
  lang,
  onBack,
}: {
  work: Work;
  lang: "cn" | "en";
  onBack: () => void;
}) {
  const detailMediaBorderRadiusPx = 4;

  useLayoutEffect(() => {
    // 进入详情页时滚动到顶部，避免刷新/恢复滚动后又被“还原回来”
    if (typeof window === "undefined") return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const raf1 = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
    };
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

              <div className="flex flex-col gap-8">
                {(
                  work.detailMedia ??
                  (work.detailImages ?? [work.image]).map((src) => ({ type: "image" as const, src }))
                ).map(
                  (media, i) => {
                  const block = (() => {
                    if (media.type === "imageTwoUpThenOne") {
                      const frameClassName =
                        "overflow-hidden bg-transparent border-[0.5px] border-[#E6E6E6]";
                      return (
                        <div className="flex flex-col" style={{ gap: `${Math.max(0, media.gapPx)}px` }}>
                          <div className="grid grid-cols-2" style={{ gap: `${Math.max(0, media.gapPx)}px` }}>
                            <div className={frameClassName} style={{ borderRadius: detailMediaBorderRadiusPx }}>
                              <ModalLazyImage
                                src={publicAssetUrl(media.topLeftSrc)}
                                alt={`${work.title} - ${i + 1}-a`}
                                eager
                                scrollRoot={undefined}
                              />
                            </div>
                            <div className={frameClassName} style={{ borderRadius: detailMediaBorderRadiusPx }}>
                              <ModalLazyImage
                                src={publicAssetUrl(media.topRightSrc)}
                                alt={`${work.title} - ${i + 1}-b`}
                                eager
                                scrollRoot={undefined}
                              />
                            </div>
                          </div>
                          <div className={frameClassName} style={{ borderRadius: detailMediaBorderRadiusPx }}>
                            <ModalLazyImage
                              src={publicAssetUrl(media.bottomSrc)}
                              alt={`${work.title} - ${i + 1}-c`}
                              eager
                              scrollRoot={undefined}
                            />
                          </div>
                        </div>
                      );
                    }

                    const resolvedSrc = publicAssetUrl(media.src);
                    if (media.type === "video") {
                      return (
                        <div
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
                        className="overflow-hidden bg-transparent border-[0.5px] border-[#E6E6E6]"
                        style={{ borderRadius: detailMediaBorderRadiusPx }}
                      >
                        <ModalLazyImage
                          src={resolvedSrc}
                          alt={`${work.title} - ${i + 1}`}
                          eager
                          scrollRoot={undefined}
                        />
                      </div>
                    );
                  })();

                  return <div key={i}>{block}</div>;
                }
                )}
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

