import { useLayoutEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import type { Work } from "../works/types";
import ModalLazyImage from "../components/ModalLazyImage";
import { publicAssetUrl } from "../utils/publicAssetUrl";

function frameShellClass(borderVisible: boolean) {
  return `overflow-hidden bg-transparent box-border border-[0.5px] ${
    borderVisible ? "border-[#E6E6E6]" : "border-transparent"
  }`;
}

function DetailMediaImageFrame({ src, alt, borderRadiusPx }: { src: string; alt: string; borderRadiusPx: number }) {
  const [borderVisible, setBorderVisible] = useState(false);
  return (
    <div className={frameShellClass(borderVisible)} style={{ borderRadius: borderRadiusPx }}>
      <ModalLazyImage src={src} alt={alt} eager scrollRoot={undefined} onLoadedChange={setBorderVisible} />
    </div>
  );
}

function DetailVideoFrame({ src, borderRadiusPx }: { src: string; borderRadiusPx: number }) {
  const [borderVisible, setBorderVisible] = useState(false);
  return (
    <div className={frameShellClass(borderVisible)} style={{ borderRadius: borderRadiusPx }}>
      <video
        src={src}
        className="block w-full h-auto object-cover"
        autoPlay
        muted
        playsInline
        loop
        controls={false}
        preload="metadata"
        onLoadedData={() => setBorderVisible(true)}
        onError={() => setBorderVisible(true)}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}

function formatDetailsBody(details: Array<{ label: string; value: string }>) {
  return details
    .map((item) => {
      const label = item.label.trim().replace(/[:：]\s*$/, "");
      return `${label}: ${item.value}`;
    })
    .join("\n");
}

function DetailTopCopy({
  title,
  details,
  overview,
  lang,
}: {
  title: string;
  details: Array<{ label: string; value: string }>;
  overview?: string;
  lang: "cn" | "en";
}) {
  const showDetailsColumn = details.length > 0;
  const showOverviewColumn = Boolean(overview || title);
  const overviewBody =
    overview ??
    (lang === "en"
      ? "You can place a project description here and update it as needed."
      : "可在此填写项目说明，并按需更新。");
  const detailsBody = formatDetailsBody(details);

  return (
    <div className="pt-8 pb-4 min-[801px]:pb-5 mb-6 min-[801px]:mb-10">
      <h2 className="mt-[70px] text-[24px] leading-[1.15] font-medium font-ui-sans-cn text-[rgba(38,37,31,1)]">{title}</h2>

      <div
        className={`mt-8 grid grid-cols-1 gap-10 min-[801px]:mt-10 ${
          showDetailsColumn && showOverviewColumn ? "min-[801px]:grid-cols-2" : ""
        }`}
      >
        {showDetailsColumn && (
          <section className="min-w-0">
            <h3 className="mb-4 text-[11px] font-normal text-[#b0b0b0]">{lang === "en" ? "Details" : "细节"}</h3>
            <p className="whitespace-pre-line text-[11px] leading-relaxed text-[#000000]">{detailsBody}</p>
          </section>
        )}

        {showOverviewColumn && (
          <section className="min-w-0">
            <h3 className="mb-4 text-[11px] font-normal text-[#b0b0b0]">{lang === "en" ? "Overview" : "简介"}</h3>
            <p className="text-[11px] leading-relaxed text-[#000000]">{overviewBody}</p>
          </section>
        )}
      </div>
    </div>
  );
}

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
  const detailTitle = useMemo(
    () => (lang === "en" ? work.detailTitleEn ?? work.detailTitle ?? work.title : work.detailTitle ?? work.title),
    [lang, work.detailTitle, work.detailTitleEn, work.title]
  );
  const overview = useMemo(
    () => (lang === "en" ? work.overviewEn ?? work.overview : work.overview),
    [lang, work.overview, work.overviewEn]
  );
  const hasTopCopy = Boolean(detailTitle || overview || details.length > 0);
  const detailSections = useMemo(() => {
    if (!work.detailSections?.length) return [];
    return work.detailSections.map((section) => {
      const sectionTitle = lang === "en" ? section.titleEn ?? section.title : section.title;
      const sectionDetails = (lang === "en" ? section.detailsEn ?? section.details : section.details) ?? [];
      const sectionOverview = lang === "en" ? section.overviewEn ?? section.overview : section.overview;
      return { ...section, title: sectionTitle, details: sectionDetails, overview: sectionOverview };
    });
  }, [lang, work.detailSections]);

  const mediaBlocks = useMemo(() => {
    if (detailSections.length > 0) {
      return detailSections.map((section) => ({
        topCopy: section,
        media:
          section.detailMedia ??
          (work.detailImages ?? [work.image]).map((src) => ({ type: "image" as const, src })),
      }));
    }

    return [
      {
        topCopy: null,
        media:
          work.detailMedia ??
          (work.detailImages ?? [work.image]).map((src) => ({ type: "image" as const, src })),
      },
    ];
  }, [detailSections, work.detailImages, work.detailMedia, work.image]);

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

              {detailSections.length === 0 && hasTopCopy && (
                <DetailTopCopy title={detailTitle} details={details} overview={overview} lang={lang} />
              )}

              <div className="flex flex-col gap-[30px]">
                {mediaBlocks.map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`} className="flex flex-col gap-[30px]">
                    {section.topCopy && (
                      <DetailTopCopy
                        title={section.topCopy.title}
                        details={section.topCopy.details ?? []}
                        overview={section.topCopy.overview}
                        lang={lang}
                      />
                    )}
                    {section.media.map((media, i) => {
                      const block = (() => {
                        if (media.type === "imageTwoUpThenOne") {
                          return (
                            <div className="flex flex-col" style={{ gap: `${Math.max(0, media.gapPx)}px` }}>
                              <div className="grid grid-cols-2" style={{ gap: `${Math.max(0, media.gapPx)}px` }}>
                                <DetailMediaImageFrame
                                  src={publicAssetUrl(media.topLeftSrc)}
                                  alt={`${work.title} - ${sectionIndex + 1}-${i + 1}-a`}
                                  borderRadiusPx={detailMediaBorderRadiusPx}
                                />
                                <DetailMediaImageFrame
                                  src={publicAssetUrl(media.topRightSrc)}
                                  alt={`${work.title} - ${sectionIndex + 1}-${i + 1}-b`}
                                  borderRadiusPx={detailMediaBorderRadiusPx}
                                />
                              </div>
                              <DetailMediaImageFrame
                                src={publicAssetUrl(media.bottomSrc)}
                                alt={`${work.title} - ${sectionIndex + 1}-${i + 1}-c`}
                                borderRadiusPx={detailMediaBorderRadiusPx}
                              />
                            </div>
                          );
                        }

                        const resolvedSrc = publicAssetUrl(media.src);
                        if (media.type === "video") {
                          return <DetailVideoFrame src={resolvedSrc} borderRadiusPx={detailMediaBorderRadiusPx} />;
                        }

                        return (
                          <DetailMediaImageFrame
                            src={resolvedSrc}
                            alt={`${work.title} - ${sectionIndex + 1}-${i + 1}`}
                            borderRadiusPx={detailMediaBorderRadiusPx}
                          />
                        );
                      })();

                      return <div key={`${sectionIndex}-${i}`}>{block}</div>;
                    })}
                    {sectionIndex < mediaBlocks.length - 1 && (
                      <div className="my-0 h-[0.5px] w-full bg-[#E6E6E6]" aria-hidden />
                    )}
                  </div>
                ))}
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

