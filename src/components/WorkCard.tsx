import { useEffect, useMemo, useRef, useState } from "react";
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
  /** 首页级预加载闸门，true 后才允许卡片入场 */
  pageReady?: boolean;
}

export default function WorkCard({ work, onClick, isFirst, lang, animationIndex = 0, loadNonce, pageReady = true }: WorkCardProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDecoded, setImageDecoded] = useState(false);
  const [overlayLoaded, setOverlayLoaded] = useState(false);
  const [overlayDecoded, setOverlayDecoded] = useState(false);
  const [isInView, setIsInView] = useState(Boolean(isFirst));
  const [imageVisible, setImageVisible] = useState(false);
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
    setImageDecoded(false);
    setOverlayLoaded(false);
    setOverlayDecoded(false);
    setIsInView(Boolean(isFirst));
    setImageVisible(false);
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
    if (!imageLoaded) return;
    const img = imageRef.current;
    if (!img) return;
    let cancelled = false;
    const done = () => {
      if (!cancelled) setImageDecoded(true);
    };
    if (typeof img.decode === "function") {
      img.decode().then(done).catch(done);
    } else {
      done();
    }
    return () => {
      cancelled = true;
    };
  }, [imageLoaded, work.image, loadNonce]);

  useEffect(() => {
    if (!work.overlayIcon) {
      setOverlayDecoded(true);
      return;
    }
    if (!overlayLoaded) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    let cancelled = false;
    const done = () => {
      if (!cancelled) setOverlayDecoded(true);
    };
    if (typeof overlay.decode === "function") {
      overlay.decode().then(done).catch(done);
    } else {
      done();
    }
    return () => {
      cancelled = true;
    };
  }, [overlayLoaded, work.overlayIcon, loadNonce]);

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
          <div className="relative z-1">
            <img
              ref={imageRef}
              src={work.image}
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
                ref={overlayRef}
                src={work.overlayIcon}
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 max-h-[88%] max-w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
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
  const delayMs = Math.round(clampedAnimationIndex * (useLightProfile ? 36 : 48));
  const distancePx = useLightProfile ? 14 : 18;
  const durationMs = useLightProfile ? 320 : 380;
  const cardReady = imageDecoded && (!work.overlayIcon || overlayDecoded);
  const shouldReveal = pageReady && isInView && cardReady;
  // 背景图单独放慢，让 0 -> 100 的出现更“温柔”可感知。
  const imageSettleDurationMs = (durationMs + (useLightProfile ? 460 : 560)) * 5;

  const revealStyle = reducedMotion
    ? undefined
    : {
      opacity: shouldReveal ? 1 : 0,
      transform: shouldReveal ? "translate3d(0,0,0)" : `translate3d(0,${distancePx}px,0)`,
      transitionProperty: "opacity, transform",
      transitionDuration: `${durationMs}ms`,
      transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
      transitionDelay: shouldReveal ? `${delayMs}ms` : "0ms",
      willChange: shouldReveal ? "auto" : "opacity, transform",
    } as const;

  const imageRevealStyle = reducedMotion
    ? undefined
    : {
      opacity: imageVisible ? 1 : 0,
      transform: imageVisible ? "scale(1)" : "scale(1.028)",
      transitionProperty: "opacity, transform",
      transitionDuration: `${imageSettleDurationMs}ms`,
      transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      transitionDelay: "0ms",
      willChange: imageVisible ? "auto" : "opacity, transform",
    } as const;

  const imageVeilStyle = reducedMotion
    ? undefined
    : {
      opacity: imageVisible ? 0 : 0.18,
      transitionProperty: "opacity",
      transitionDuration: `${imageSettleDurationMs}ms`,
      transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      transitionDelay: "0ms",
    } as const;

  useEffect(() => {
    if (!shouldReveal) return;
    setImageVisible(false);
    const raf = window.requestAnimationFrame(() => setImageVisible(true));
    return () => window.cancelAnimationFrame(raf);
  }, [delayMs, shouldReveal, loadNonce, work.image]);

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className="min-w-0 overflow-hidden rounded-[8px]"
      style={revealStyle}
    >
      <div
        style={{
          opacity: shouldReveal ? 1 : 0,
          transition: reducedMotion ? undefined : `opacity ${durationMs}ms cubic-bezier(0.22,1,0.36,1)`,
          transitionDelay: reducedMotion || !shouldReveal ? "0ms" : `${delayMs}ms`,
        }}
      >
        {renderCardContent()}
      </div>
    </article>
  );
}
