import { useEffect, useMemo, useRef, useState } from "react";
import type { Work } from "../works/types";
import { publicAssetUrl } from "../utils/publicAssetUrl";

interface WorkCardProps {
  work: Work;
  onClick?: (work: Work, origin: { x: number; y: number }) => void;
  isFirst?: boolean;
  lang: "cn" | "en";
}

export default function WorkCard({ work, onClick, isFirst, lang }: WorkCardProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(Boolean(isFirst));
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    setIsInView(Boolean(isFirst));
  }, [work.image, work.id, isFirst]);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) setImageLoaded(true);
  }, [work.image, work.id]);

  useEffect(() => {
    if (isInView) return;
    let observer: IntersectionObserver | null = null;
    let rafId = 0;
    let cancelled = false;
    const startObserve = () => {
      if (cancelled || isInView) return;
      const el = cardRef.current;
      if (!el) {
        rafId = requestAnimationFrame(startObserve);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            setIsInView(true);
            observer?.unobserve(entry.target);
            break;
          }
        },
        { root: null, rootMargin: "0px 0px 1000px 0px", threshold: 0 }
      );
      observer.observe(el);
    };
    rafId = requestAnimationFrame(startObserve);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [isInView, work.id]);

  const isLikelySafari = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Android/i.test(ua);
  }, []);

  const isMobileViewport = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(max-width: 800px)").matches;
  }, []);

  function handleActivate(e: React.MouseEvent | React.KeyboardEvent) {
    if (!onClick) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    onClick(work, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate(e);
    }
  }

  const useLightProfile = isMobileViewport || isLikelySafari;
  const durationMs = useLightProfile ? 320 : 380;
  const imageSettleDurationMs = durationMs + (useLightProfile ? 260 : 320);
  const isPriorityImage = Boolean(isFirst);

  const settled = isInView && imageLoaded;

  const imageRevealStyle = reducedMotion
    ? undefined
    : ({
        opacity: settled ? 1 : 0,
        transform: settled ? "scale(1)" : "scale(1.02)",
        transitionProperty: "opacity, transform",
        transitionDuration: `${imageSettleDurationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: "0ms",
        willChange: settled ? "auto" : "opacity, transform",
      } as const);

  const imageVeilStyle = reducedMotion
    ? undefined
    : ({
        opacity: isInView && !imageLoaded ? 0.14 : 0,
        transitionProperty: "opacity",
        transitionDuration: `${imageSettleDurationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: "0ms",
      } as const);

  const cardImageHeightPx = work.cardImageHeightPx ?? 509;
  const year = (() => {
    const m = String(work.date ?? "").match(/\b(\d{4})\b/);
    return m?.[1] ?? String(work.date ?? "").slice(0, 4);
  })();
  const cardIntro =
    (lang === "en" ? work.cardIntroEn ?? work.cardIntro : work.cardIntro) ??
    (lang === "en" ? work.typeLabelEn ?? work.typeLabel : work.typeLabel) ??
    (lang === "en" ? work.overviewEn ?? work.overview : work.overview) ??
    "";

  return (
    <article ref={cardRef as React.RefObject<HTMLElement>} className="min-w-0 overflow-hidden rounded-[8px]">
      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className="rounded-[8px] border-[0.5px] border-transparent cursor-pointer"
      >
        <div className="relative w-full overflow-hidden rounded-superellipse border-[0.5px] border-[#e0e0e0]">
          <div className="pointer-events-none absolute inset-0 bg-[#e7ecee]" />
          <div className="relative z-1">
            <img
              ref={imageRef}
              src={publicAssetUrl(work.image)}
              alt={work.title}
              className="block w-full object-cover"
              style={{ height: cardImageHeightPx, ...imageRevealStyle }}
              loading={isPriorityImage ? "eager" : "lazy"}
              fetchPriority={isPriorityImage ? "high" : "low"}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-white" style={imageVeilStyle} />
            {work.overlayIcon && (
              <img
                src={publicAssetUrl(work.overlayIcon)}
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 max-h-[88%] max-w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
                decoding="async"
              />
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-0.5 leading-[16px]">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="min-w-0 text-[12px] font-normal text-[#000000] truncate">{work.title}</h3>
            <div className="shrink-0 text-[12px] text-[#000000] tabular-nums">{year}</div>
          </div>
          <div className="text-[11px] text-[#888888] line-clamp-2">{cardIntro}</div>
        </div>
      </div>
    </article>
  );
}
