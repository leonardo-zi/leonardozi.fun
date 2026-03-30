import { useCallback, useEffect, useRef, type SyntheticEvent } from "react";
import type { AlbumItem } from "../../../data/albumCatalog";

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

  useEffect(() => {
    if (index !== loadCursor || !shouldAttachMedia) return;
    if (item.mediaType === "video") {
      const v = videoRef.current;
      if (v && v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) reportSlotReady();
      return;
    }
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) reportSlotReady();
  }, [index, loadCursor, shouldAttachMedia, item.mediaType, item.image, reportSlotReady]);

  return (
    <article className="min-w-0 overflow-hidden rounded-[8px]">
      <div className="aspect-square w-full rounded-superellipse border-[0.5px] border-[#e0e0e0] overflow-hidden bg-[rgba(162,157,150,0.12)] contain-layout">
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
              preload="auto"
              aria-label={item.album}
              onLoadedData={reportSlotReady}
              onError={reportSlotReady}
              onPause={resumeIfNotEnded}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <img
              ref={imgRef}
              src={item.image}
              alt={item.album}
              className="block h-full w-full object-cover"
              decoding="async"
              fetchPriority={index === loadCursor ? "high" : "low"}
              onLoad={reportSlotReady}
              onError={reportSlotReady}
            />
          )
        ) : null}
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
