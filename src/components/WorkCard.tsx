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
import OfficialDarkVeil from "./DarkVeilWrapper";
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
  const darkVeilOffsetY = Number(params.offsetY ?? 0);
  const darkVeilScale = Number(params.scale ?? 1 + Math.abs(darkVeilOffsetY) * 1.2);
  const darkVeilStyle: CSSProperties = {
    transform: `translateY(${darkVeilOffsetY * 100}%) scale(${darkVeilScale})`,
    transformOrigin: "center",
  };

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
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: fallbackColor }}>
        <div className="absolute inset-0" style={darkVeilStyle}>
          <OfficialDarkVeil
            hueShift={Number(params.hueShift ?? 0)}
            noiseIntensity={Number(params.noiseIntensity ?? 0)}
            scanlineIntensity={Number(params.scanlineIntensity ?? 0)}
            speed={Number(params.speed ?? 3)}
            scanlineFrequency={Number(params.scanlineFrequency ?? 0.5)}
            warpAmount={Number(params.warpAmount ?? 0)}
            resolutionScale={Number(params.resolutionScale ?? 1)}
          />
        </div>
      </div>
    );
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

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: fallbackColor }}>
      <div className="absolute inset-0" style={darkVeilStyle}>
        <OfficialDarkVeil
          hueShift={Number(params.hueShift ?? 0)}
          noiseIntensity={Number(params.noiseIntensity ?? 0)}
          scanlineIntensity={Number(params.scanlineIntensity ?? 0)}
          speed={Number(params.speed ?? 3)}
          scanlineFrequency={Number(params.scanlineFrequency ?? 0.5)}
          warpAmount={Number(params.warpAmount ?? 0)}
          resolutionScale={Number(params.resolutionScale ?? 1)}
        />
      </div>
    </div>
  );
}

function CrossfadeVideo({
  src,
  playbackRate,
  autoPlay,
  muted,
  playsInline,
  controls,
  preload,
  crossfade,
  fit = "contain",
  onReady,
}: {
  src: string;
  playbackRate?: number;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  crossfade: { fadeDurationMs: number; preloadLeadMs?: number };
  fit?: "contain" | "cover";
  onReady?: () => void;
}) {
  const aRef = useRef<HTMLVideoElement | null>(null);
  const bRef = useRef<HTMLVideoElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<0 | 1>(0);
  const [fadingTo, setFadingTo] = useState<0 | 1 | null>(null);
  const isFadingRef = useRef(false);
  const fadeDurationMs = Math.max(0, crossfade.fadeDurationMs);
  const preloadLeadMs = Math.max(0, crossfade.preloadLeadMs ?? fadeDurationMs + 120);

  const getRef = (index: 0 | 1) => (index === 0 ? aRef : bRef);
  const getVideo = (index: 0 | 1) => getRef(index).current;

  const applyPlaybackRate = (el: HTMLVideoElement | null) => {
    if (!el) return;
    if (typeof playbackRate === "number" && Number.isFinite(playbackRate)) {
      el.playbackRate = playbackRate;
    }
  };
  const readyOnceRef = useRef(false);
  const reportReady = () => {
    if (readyOnceRef.current) return;
    readyOnceRef.current = true;
    onReady?.();
  };

  const startFadeTo = (nextIndex: 0 | 1) => {
    if (isFadingRef.current) return;
    const nextVideo = getVideo(nextIndex);
    if (!nextVideo) return;
    isFadingRef.current = true;
    nextVideo.currentTime = 0;
    applyPlaybackRate(nextVideo);
    nextVideo.play().catch(() => undefined);
    setFadingTo(nextIndex);

    window.setTimeout(() => {
      const prevIndex = nextIndex === 0 ? 1 : 0;
      const prevVideo = getVideo(prevIndex);
      if (prevVideo) {
        prevVideo.pause();
        prevVideo.currentTime = 0;
      }
      setActiveIndex(nextIndex);
      setFadingTo(null);
      isFadingRef.current = false;
    }, fadeDurationMs);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const activeVideo = getVideo(activeIndex);
    if (!activeVideo) return;
    applyPlaybackRate(activeVideo);
    activeVideo.play().catch(() => undefined);
  }, [activeIndex, autoPlay]);

  const handleTimeUpdate = (index: 0 | 1) => {
    if (index !== activeIndex || isFadingRef.current) return;
    const video = getVideo(index);
    if (!video || !Number.isFinite(video.duration)) return;
    const remainingMs = Math.max(0, (video.duration - video.currentTime) * 1000);
    if (remainingMs <= preloadLeadMs) {
      startFadeTo(index === 0 ? 1 : 0);
    }
  };

  const videoStyle = (index: 0 | 1): CSSProperties => {
    const isActive = index === activeIndex;
    const isFadingTarget = fadingTo === index;
    const visible = fadingTo ? isFadingTarget : isActive;
    return {
      opacity: visible ? 1 : 0,
      transition: `opacity ${fadeDurationMs}ms ease`,
    };
  };

  return (
    <div className="relative h-full w-full">
      {[0, 1].map((idx) => {
        const index = idx as 0 | 1;
        return (
          <video
            key={`xf-${index}`}
            ref={index === 0 ? aRef : bRef}
            src={publicAssetUrl(src)}
            className={`absolute inset-0 block h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
            style={videoStyle(index)}
            autoPlay={autoPlay ?? true}
            muted={muted ?? true}
            playsInline={playsInline ?? true}
            loop={false}
            controls={controls ?? false}
            preload={preload ?? "metadata"}
            onContextMenu={(e) => e.preventDefault()}
            onLoadedMetadata={(e) => {
              applyPlaybackRate(e.currentTarget);
              reportReady();
            }}
            onCanPlay={(e) => {
              applyPlaybackRate(e.currentTarget);
              reportReady();
            }}
            onPlay={(e) => applyPlaybackRate(e.currentTarget)}
            onTimeUpdate={() => handleTimeUpdate(index)}
          />
        );
      })}
    </div>
  );
}

function renderForegroundNode(
  foreground: WorkCardCoverForeground,
  onMediaLoaded?: () => void
) {
  if (foreground.type === "image") {
    return (
      <img
        src={publicAssetUrl(foreground.src)}
        alt=""
        aria-hidden
        className="block h-auto w-full object-contain"
        loading="lazy"
        decoding="async"
        onLoad={onMediaLoaded}
        onError={onMediaLoaded}
      />
    );
  }

  if (foreground.type === "video") {
    const playbackRate = foreground.playbackRate;
    if (foreground.crossfade) {
      return (
        <CrossfadeVideo
          src={foreground.src}
          playbackRate={playbackRate}
          autoPlay={foreground.autoPlay}
          muted={foreground.muted}
          playsInline={foreground.playsInline}
          controls={foreground.controls}
          preload={foreground.preload}
          crossfade={foreground.crossfade}
          onReady={onMediaLoaded}
        />
      );
    }
    return (
      <video
        src={publicAssetUrl(foreground.src)}
        className="block h-auto w-full object-contain"
        ref={(el) => {
          if (el && typeof playbackRate === "number") {
            el.playbackRate = playbackRate;
          }
        }}
        autoPlay={foreground.autoPlay ?? true}
        muted={foreground.muted ?? true}
        playsInline={foreground.playsInline ?? true}
        loop={foreground.loop ?? true}
        controls={foreground.controls ?? false}
        preload={foreground.preload ?? "metadata"}
        onContextMenu={(e) => e.preventDefault()}
        onCanPlay={(e) => {
          if (typeof playbackRate === "number") {
            e.currentTarget.playbackRate = playbackRate;
          }
          onMediaLoaded?.();
        }}
        onLoadedMetadata={(e) => {
          if (typeof playbackRate === "number") {
            e.currentTarget.playbackRate = playbackRate;
          }
          onMediaLoaded?.();
        }}
        onPlay={(e) => {
          if (typeof playbackRate === "number") {
            e.currentTarget.playbackRate = playbackRate;
          }
        }}
        onError={onMediaLoaded}
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
            onLoad={onMediaLoaded}
            onError={onMediaLoaded}
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
  const [coverBgLoaded, setCoverBgLoaded] = useState(false);
  const [coverFgLoadedCount, setCoverFgLoadedCount] = useState(0);
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
    setCoverBgLoaded(false);
    setCoverFgLoadedCount(0);
  }, [work.image, work.id, isFirst]);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) setImageLoaded(true);
  }, [work.image, work.id]);

  const coverFgExpected = useMemo(() => {
    if (!work.cardCover?.foreground) return 0;
    const fg = work.cardCover.foreground;
    if (fg.type === "image" || fg.type === "video") return 1;
    return fg.items.filter((item) => item.type === "image").length;
  }, [work.cardCover?.foreground]);

  useEffect(() => {
    if (!work.cardCover) return;
    const bg = work.cardCover.background;
    if (bg.type === "color" || bg.type === "reactbits") {
      setCoverBgLoaded(true);
    }
    if (coverFgExpected === 0) {
      setCoverFgLoadedCount(0);
    }
  }, [work.cardCover, coverFgExpected]);

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
  const coverFgLoaded = coverFgExpected === 0 ? true : coverFgLoadedCount >= coverFgExpected;
  const settled = hasNewCardCover ? isInView && coverBgLoaded && coverFgLoaded : isInView && imageLoaded;
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
  const cardImageAspectRatio = work.cardImageAspectRatio;
  const cardImageContainerStyle = cardImageAspectRatio
    ? ({ aspectRatio: cardImageAspectRatio, height: "auto" } as const)
    : ({ height: cardImageHeightPx } as const);
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

  const foregroundScale = (() => {
    if (!work.cardCover?.foreground) return 1;
    const fg = work.cardCover.foreground;
    if (fg.type !== "stack") return 1;
    if (!fg.scaleWithPlacement) return 1;
    if (fg.placement.mode !== "centerRatio") return 1;
    const base = fg.scaleWithPlacement.baseWidthRatio;
    const current = fg.placement.widthRatio;
    if (!Number.isFinite(base) || !Number.isFinite(current) || base <= 0 || current <= 0) return 1;
    return current / base;
  })();

  const coverContent = hasNewCardCover ? (
    <div className="relative block h-full w-full overflow-hidden" style={imageRevealStyle}>
      {work.cardCover?.background.type === "color" && (
        <div
          className="absolute bottom-0 right-0 h-full w-full"
          style={{ background: work.cardCover.background.color }}
        />
      )}
      {work.cardCover?.background.type === "image" && (
        <img
          src={publicAssetUrl(work.cardCover.background.src)}
          alt=""
          aria-hidden
          className="absolute inset-0 block h-full w-full object-cover"
          decoding="async"
          loading={isPriorityImage ? "eager" : "lazy"}
          onLoad={() => setCoverBgLoaded(true)}
          onError={() => setCoverBgLoaded(true)}
        />
      )}
      {work.cardCover?.background.type === "video" && work.cardCover.background.crossfade && (
        <CrossfadeVideo
          src={work.cardCover.background.src}
          autoPlay={work.cardCover.background.autoPlay}
          muted={work.cardCover.background.muted}
          playsInline={work.cardCover.background.playsInline}
          controls={work.cardCover.background.controls}
          preload={work.cardCover.background.preload}
          crossfade={work.cardCover.background.crossfade}
          fit="cover"
          onReady={() => setCoverBgLoaded(true)}
        />
      )}
      {work.cardCover?.background.type === "video" && !work.cardCover.background.crossfade && (
        <video
          className="absolute inset-0 block h-full w-full object-cover"
          src={publicAssetUrl(work.cardCover.background.src)}
          autoPlay={work.cardCover.background.autoPlay ?? true}
          muted={work.cardCover.background.muted ?? true}
          loop={work.cardCover.background.loop ?? true}
          playsInline={work.cardCover.background.playsInline ?? true}
          controls={work.cardCover.background.controls ?? false}
          preload={work.cardCover.background.preload ?? "metadata"}
          poster={work.cardCover.background.poster ? publicAssetUrl(work.cardCover.background.poster) : undefined}
          onLoadedData={() => setCoverBgLoaded(true)}
          onError={() => setCoverBgLoaded(true)}
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
          <div style={getPlacementStyle(work.cardCover.foreground.placement)}>
            <div
              style={
                foregroundScale === 1
                  ? undefined
                  : ({ transform: `scale(${foregroundScale})`, transformOrigin: "center" } as const)
              }
            >
              {renderForegroundNode(work.cardCover.foreground, () => {
                setCoverFgLoadedCount((count) => Math.min(coverFgExpected, count + 1));
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[#e7ecee]" />
      <div className="relative z-1 h-full">
        <SmartImage
          ref={imageRef}
          src={publicAssetUrl(work.image)}
          alt={work.title}
          className="block h-full w-full object-cover"
          style={imageRevealStyle}
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
        <div
          className="relative w-full overflow-hidden rounded-superellipse border-[0.5px] border-[#E6E6E6]"
          style={cardImageContainerStyle}
        >
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
