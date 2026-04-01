import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ComponentType } from "react";
import * as ReactBits from "reactbits-animation";
import type {
  Work,
  WorkCardCover,
  WorkCardCoverForeground,
  WorkCardCoverForegroundPlacement,
} from "../works/types";
import { publicAssetUrl } from "../utils/publicAssetUrl";
import SmartImage from "./SmartImage";

interface WorkCardProps {
  work: Work;
  onClick?: (work: Work, origin: { x: number; y: number }) => void;
  isFirst?: boolean;
  lang: "cn" | "en";
}

function getPlacementStyle(placement: WorkCardCoverForegroundPlacement): CSSProperties {
  if (placement.mode === "center") {
    return { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  }

  if (placement.mode === "centerRatio") {
    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: `${Math.max(0, placement.widthRatio) * 100}%`,
      transform: "translate(-50%, -50%)",
    };
  }

  if (placement.mode === "centerFixedWidth") {
    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: `${Math.max(0, placement.widthPx)}px`,
      transform: "translate(-50%, -50%)",
    };
  }

  const leftPct = ((placement.coordinate.x + 20) / 40) * 100;
  const topPct = ((10 - placement.coordinate.y) / 20) * 100;

  return {
    position: "absolute",
    left: `${leftPct}%`,
    top: `${topPct}%`,
    width:
      typeof placement.widthPx === "number"
        ? `${Math.max(0, placement.widthPx)}px`
        : typeof placement.widthRatio === "number"
          ? `${Math.max(0, placement.widthRatio) * 100}%`
          : undefined,
    transform: `translate(${-placement.anchor.x * 100}%, ${-placement.anchor.y * 100}%)`,
  };
}

function renderReactBitsBackground(cover: WorkCardCover, reducedMotion: boolean) {
  if (cover.background.type !== "reactbits") return null;

  const fallbackColor = cover.background.fallbackColor ?? "#0d0d0d";
  const params = cover.background.params ?? {};
  const maybeExports = ReactBits as Record<string, unknown>;
  const color1 = `#${String(params.color1 ?? "6a1f16").replace("#", "")}`;
  const color2 = `#${String(params.color2 ?? "7e2216").replace("#", "")}`;
  const color3 = `#${String(params.color3 ?? "a33c2e").replace("#", "")}`;
  const blend = Number(params.blend ?? 0.55);

  if (!reducedMotion && cover.background.effect === "aurora") {
    const Aurora = maybeExports.Aurora as ComponentType<Record<string, unknown>> | undefined;
    if (Aurora) {
      return (
        <div className="absolute inset-0 overflow-hidden" style={{ background: fallbackColor }}>
          <Aurora colorStops={[color1, color2, color3]} blend={blend} amplitude={1} />
        </div>
      );
    }
  }

  if (!reducedMotion && cover.background.effect === "darkVeil") {
    const DarkVeil = maybeExports.DarkVeil as ComponentType<Record<string, unknown>> | undefined;
    if (DarkVeil) {
      return <DarkVeil {...params} />;
    }
  }

  if (cover.background.effect === "aurora") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 25%, ${color1} 0%, transparent 45%),
          radial-gradient(circle at 78% 30%, ${color2} 0%, transparent 40%),
          radial-gradient(circle at 48% 78%, ${color3} 0%, transparent 45%),
          ${fallbackColor}`,
          opacity: Math.min(1, Math.max(0.25, blend)),
        }}
      />
    );
  }

  const frequency = Number(params.scanlineFrequency ?? 0.5);
  const lineGapPx = Math.max(2, Math.round(8 / Math.max(0.2, frequency)));
  const speed = Math.max(0.4, Number(params.speed ?? 3));
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: fallbackColor }}>
      <style>{`
        @keyframes darkVeilGlowShift {
          0% { transform: translate3d(-2%, -1%, 0) scale(1.03); opacity: 0.65; }
          50% { transform: translate3d(2%, 1.5%, 0) scale(1.06); opacity: 0.85; }
          100% { transform: translate3d(-2%, -1%, 0) scale(1.03); opacity: 0.65; }
        }
        @keyframes darkVeilScanMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 ${lineGapPx * 2}px; }
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 80% at 50% 10%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 26%, rgba(0,0,0,0) 55%), radial-gradient(90% 60% at 50% 75%, rgba(15,15,15,0.55) 0%, rgba(0,0,0,0) 70%)",
          animation: `darkVeilGlowShift ${Math.max(2, 7 / speed)}s ease-in-out infinite`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.04) 0px,
            rgba(255,255,255,0.04) 1px,
            rgba(0,0,0,0) 1px,
            rgba(0,0,0,0) ${lineGapPx}px
          )`,
          mixBlendMode: "screen",
          opacity: 0.6,
          animation: `darkVeilScanMove ${Math.max(0.8, 2.6 / speed)}s linear infinite`,
        }}
      />
    </div>
  );
}

function renderForegroundNode(foreground: WorkCardCoverForeground) {
  if (foreground.type === "image") {
    return (
      <img
        src={publicAssetUrl(foreground.src)}
        alt=""
        aria-hidden
        className="block h-auto w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (foreground.type === "video") {
    return (
      <video
        src={publicAssetUrl(foreground.src)}
        className="block h-auto w-full object-contain"
        autoPlay={foreground.autoPlay ?? true}
        muted={foreground.muted ?? true}
        playsInline={foreground.playsInline ?? true}
        loop={foreground.loop ?? true}
        controls={foreground.controls ?? false}
        preload={foreground.preload ?? "metadata"}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }

  return (
    <div className="flex flex-col items-center" style={{ gap: `${Math.max(0, foreground.gapPx)}px` }}>
      {foreground.items.map((item, idx) => {
        if (item.type === "text") {
          return (
            <p
              key={`text-${idx}`}
              className="leading-none whitespace-nowrap"
              style={{
                fontSize: `${Math.max(0, item.fontSizePx)}px`,
                fontWeight: item.fontWeight,
                color: item.color ?? "#ffffff",
              }}
            >
              {item.text}
            </p>
          );
        }
        return (
          <img
            key={`image-${idx}`}
            src={publicAssetUrl(item.src)}
            alt=""
            aria-hidden
            className="block h-auto object-contain"
            style={{
              width:
                typeof item.widthPx === "number"
                  ? `${Math.max(0, item.widthPx)}px`
                  : typeof item.widthRatio === "number"
                    ? `${Math.max(0, item.widthRatio) * 100}%`
                    : undefined,
            }}
            loading="lazy"
            decoding="async"
          />
        );
      })}
    </div>
  );
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
  const hasNewCardCover = Boolean(work.cardCover);

  const settled = hasNewCardCover ? isInView : isInView && imageLoaded;
  const metaVisible = reducedMotion ? true : settled;

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

  const cardImageHeightPx = work.cardImageHeightPx ?? 581;
  const year = (() => {
    const m = String(work.date ?? "").match(/\b(\d{4})\b/);
    return m?.[1] ?? String(work.date ?? "").slice(0, 4);
  })();
  const cardIntro =
    (lang === "en" ? work.cardIntroEn ?? work.cardIntro : work.cardIntro) ??
    (lang === "en" ? work.typeLabelEn ?? work.typeLabel : work.typeLabel) ??
    (lang === "en" ? work.overviewEn ?? work.overview : work.overview) ??
    "";

  const legacyImageVeilStyle = reducedMotion
    ? undefined
    : ({
        opacity: isInView && !imageLoaded ? 0.14 : 0,
        transitionProperty: "opacity",
        transitionDuration: `${imageSettleDurationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: "0ms",
      } as const);

  const coverContent = hasNewCardCover ? (
    <div className="relative block w-full overflow-hidden" style={{ height: cardImageHeightPx, ...imageRevealStyle }}>
      {work.cardCover?.background.type === "color" && (
        <div className="absolute inset-0" style={{ background: work.cardCover.background.color }} />
      )}
      {work.cardCover?.background.type === "image" && (
        <img
          src={publicAssetUrl(work.cardCover.background.src)}
          alt=""
          aria-hidden
          className="absolute inset-0 block h-full w-full object-cover"
          decoding="async"
          loading={isPriorityImage ? "eager" : "lazy"}
        />
      )}
      {work.cardCover?.background.type === "reactbits" &&
        (reducedMotion ? (
          <div
            className="absolute inset-0"
            style={{ background: work.cardCover.background.fallbackColor ?? "#111111" }}
          />
        ) : (
          renderReactBitsBackground(work.cardCover, reducedMotion)
        ))}

      {work.cardCover?.foreground && (
        <div className="pointer-events-none absolute inset-0 z-2">
          <div style={getPlacementStyle(work.cardCover.foreground.placement)}>{renderForegroundNode(work.cardCover.foreground)}</div>
        </div>
      )}
    </div>
  ) : (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[#e7ecee]" />
      <div className="relative z-1">
        <SmartImage
          ref={imageRef}
          src={publicAssetUrl(work.image)}
          alt={work.title}
          className="block w-full object-cover"
          style={{ height: cardImageHeightPx, ...imageRevealStyle }}
          loading={isPriorityImage ? "eager" : "lazy"}
          fetchPriority={isPriorityImage ? "high" : "low"}
          decoding="async"
          showSkeleton={isInView}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-white" style={legacyImageVeilStyle} />
        {work.overlayIcon && (
          <img
            src={publicAssetUrl(work.overlayIcon)}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-2 max-h-[88%] max-w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
            decoding="async"
          />
        )}
      </div>
    </>
  );

  return (
    <article ref={cardRef as React.RefObject<HTMLElement>} className="min-w-0 overflow-hidden rounded-[8px]">
      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className="rounded-[8px] border-[0.5px] border-transparent cursor-pointer"
      >
        <div className="relative w-full overflow-hidden rounded-superellipse border-[0.5px] border-[#E6E6E6]">
          {coverContent}
        </div>
        <div
          className="mt-2 flex flex-col gap-0.5 leading-[16px]"
          style={
            reducedMotion
              ? undefined
              : ({
                  opacity: metaVisible ? 1 : 0,
                  transitionProperty: "opacity",
                  transitionDuration: `${imageSettleDurationMs}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                } as const)
          }
        >
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
