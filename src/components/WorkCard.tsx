import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedContent } from "reactbits-animation";
import type { Work } from "../works/types";

interface WorkCardProps {
  work: Work;
  onClick?: (work: Work, origin: { x: number; y: number }) => void;
  /** 首张卡片直接可见，避免懒加载未触发导致点不开 */
  isFirst?: boolean;
  lang: "cn" | "en";
  /** 用于控制逐张出现的延时顺序 */
  animationIndex?: number;
  /** 每次页面硬刷新都不同：用于强制重新初始化入场动画 */
  loadNonce: number;
}

export default function WorkCard({ work, onClick, isFirst, lang, animationIndex = 0, loadNonce }: WorkCardProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [overlayLoaded, setOverlayLoaded] = useState(false);
  const [isInView, setIsInView] = useState(Boolean(isFirst));
  const [promoteLayer, setPromoteLayer] = useState(true);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);
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
    setOverlayLoaded(false);
    setIsInView(Boolean(isFirst));
    setPromoteLayer(true);
  }, [work.image, loadNonce]);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    if (img.complete) {
      // 缓存命中时兜底，避免出现“灰底一下子跳成成图”的生硬感。
      setImageLoaded(true);
    }
  }, [work.image, loadNonce]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !work.overlayIcon) return;
    if (overlay.complete) {
      setOverlayLoaded(true);
    }
  }, [work.overlayIcon, loadNonce]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setIsInView(true);
          observer.unobserve(entry.target);
          break;
        }
      },
      {
        root: null,
        rootMargin: "180px 0px",
        threshold: 0.02,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView]);

  const isLikelySafari = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Android/i.test(ua);
  }, []);

  const isMobileViewport = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(max-width: 800px)").matches;
  }, []);

  // 背景图淡入更慢，减少“突兀跳出”。
  const imageFadeTransition = {
    transitionProperty: "opacity",
    transitionDuration: "1800ms",
    transitionDelay: "0ms",
    transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
  } as const;
  // 中间图标在背景图之后出现，淡入可稍快一些。
  const overlayFadeTransition = {
    transitionProperty: "opacity",
    transitionDuration: "900ms",
    transitionDelay: "80ms",
    transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
  } as const;

  function handleActivate(e: React.MouseEvent | React.KeyboardEvent) {
    if (!onClick) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    onClick(work, origin);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate(e);
    }
  }

  function renderCardContent() {
    // 前几张卡片更积极加载，避免滚到可视区时仍在等待图片。
    const isPriorityImage = Boolean(isFirst || animationIndex <= 3);
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
      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className="rounded-[8px] border-[0.5px] border-transparent cursor-pointer"
      >
        <div className="relative w-full overflow-hidden rounded-superellipse border-[0.5px] border-[#e0e0e0]">
          <div className="pointer-events-none absolute inset-0 bg-[#e7ecee]" />
          <div
            className="relative z-1"
            style={{
              opacity: imageLoaded && isInView ? 1 : 0,
              ...imageFadeTransition,
            }}
          >
            <img
              ref={imageRef}
              src={work.image}
              alt={work.title}
              className="block w-full object-cover"
              style={{ height: cardImageHeightPx }}
              loading={isPriorityImage ? "eager" : "lazy"}
              fetchPriority={isPriorityImage ? "high" : "auto"}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            {work.overlayIcon && imageLoaded && (
              <img
                ref={overlayRef}
                src={work.overlayIcon}
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 max-h-[88%] max-w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
                style={{
                  opacity: imageLoaded && overlayLoaded && isInView ? 1 : 0,
                  ...overlayFadeTransition,
                }}
                decoding="async"
                onLoad={() => setOverlayLoaded(true)}
                onError={() => setOverlayLoaded(true)}
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
    );
  }

  const clampedAnimationIndex = Math.max(0, Math.min(animationIndex, 8));
  const useLightProfile = isMobileViewport || isLikelySafari;
  const delaySeconds = clampedAnimationIndex * (useLightProfile ? 0.05 : 0.07);
  const distance = useLightProfile ? 80 : 120;
  const duration = useLightProfile ? 0.65 : 0.8;
  // 提前触发：降低阈值，让卡片在更早阶段进入动画与加载流程。
  const threshold = useLightProfile ? 0.03 : 0.02;

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      setPromoteLayer(false);
      return;
    }
    const totalMs = Math.round((delaySeconds + duration) * 1000) + 120;
    const t = window.setTimeout(() => setPromoteLayer(false), totalMs);
    return () => window.clearTimeout(t);
  }, [delaySeconds, duration, isInView, reducedMotion]);

  if (reducedMotion) {
    return <article className="min-w-0 overflow-hidden rounded-[8px]">{renderCardContent()}</article>;
  }

  return (
    <AnimatedContent
      distance={distance}
      direction="vertical"
      duration={duration}
      ease="power3.out"
      initialOpacity={0.18}
      animateOpacity
      threshold={threshold}
      delay={delaySeconds}
    >
      <article
        ref={cardRef as React.RefObject<HTMLElement>}
        className="min-w-0 overflow-hidden rounded-[8px]"
        style={{ willChange: promoteLayer ? "transform, opacity" : "auto" }}
      >
        {renderCardContent()}
      </article>
    </AnimatedContent>
  );
}
