import { useCallback, useEffect, useRef, type SyntheticEvent } from "react";
import type { AlbumItem } from "../../../data/albumCatalog";
import SmartImage from "../../../components/SmartImage";

export default function AlbumCard({
  item,
  index,
  loadCursor,
  onSlotReady,
}: {
  item: AlbumItem;
  index: number;
  loadCursor: number;
  onSlotReady: () => void;
}) {
  const resumeIfNotEnded = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (!v.ended && v.paused) void v.play();
  }, []);

  const reportedRef = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    reportedRef.current = false;
  }, [loadCursor, index, item.image]);

  useEffect(() => {
    if (index !== loadCursor) return;
    const t = window.setTimeout(() => {
      if (!reportedRef.current) {
        reportedRef.current = true;
        onSlotReady();
      }
    }, 14_000);
    return () => clearTimeout(t);
  }, [index, loadCursor, onSlotReady]);

  const reportSlotReady = useCallback(() => {
    if (index !== loadCursor || reportedRef.current) return;
    reportedRef.current = true;
    onSlotReady();
  }, [index, loadCursor, onSlotReady]);

  const shouldAttachMedia = index <= loadCursor;

  return (
    <article className="min-w-0">
      <div className="aspect-square w-full border-[0.8px] border-[#E6E6E6] bg-[rgba(162,157,150,0.12)] contain-layout">
        <div className="h-full w-full overflow-hidden">
          {shouldAttachMedia ? (
            item.mediaType === "video" ? (
              <video
                ref={videoRef}
                src={item.image}
                className="pointer-events-none block h-full w-full object-cover"
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
                aria-label={item.album}
                onLoadedData={reportSlotReady}
                onError={reportSlotReady}
                onPause={resumeIfNotEnded}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <SmartImage
                ref={imgRef}
                src={item.image}
                alt={item.album}
                containerClassName="h-full w-full"
                className="block h-full w-full object-cover"
                decoding="async"
                fetchPriority={index === loadCursor ? "high" : "low"}
                onLoad={reportSlotReady}
                onError={reportSlotReady}
              />
            )
          ) : null}

          {/* 未 attach 媒体前：也显示“该卡片自己的”扫光骨架 */}
          {!shouldAttachMedia && (
            <div className="smart-image h-full w-full">
              <div className="smart-image-skeleton" data-active="true" aria-hidden />
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-0.5 leading-[16px]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate text-[12px] font-normal text-[#000000]">{item.album}</h3>
          <div className="shrink-0 text-[12px] text-[#000000] tabular-nums">{item.year}</div>
        </div>
        <div className="text-[11px] text-[#888888] truncate">{item.artist}</div>
      </div>
    </article>
  );
}
