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

function DarkVeilCanvas({ scanlineFrequency = 0.5, speed = 3 }: { scanlineFrequency?: number; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    const vertex = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;
    const fragment = `
      precision mediump float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uScanFreq;
      uniform float uSpeed;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= uResolution.x / max(1.0, uResolution.y);
        float t = uTime * max(0.1, uSpeed) * 0.26;

        float warpA = sin((p.y + t) * 3.1) * 0.16;
        float warpB = sin((p.x * 1.9 - t * 1.2) * 2.2) * 0.12;
        float warpC = sin((p.x * 2.7 + p.y * 1.3 + t * 0.9) * 1.7) * 0.06;
        vec2 q = vec2(p.x + warpA + warpB + warpC, p.y + warpB * 0.65);

        float n1 = noise(q * 2.8 + vec2(0.0, -t * 0.8));
        float n2 = noise(q * 6.5 + vec2(t * 0.3, t * 0.1));
        float veil = smoothstep(0.22, 0.92, n1 * 0.72 + n2 * 0.28);

        float vignette = smoothstep(1.22, 0.22, length(p));
        float scan = 0.5 + 0.5 * sin((uv.y + t * 0.14) * (220.0 * max(0.1, uScanFreq)));

        vec3 base = vec3(0.005, 0.000, 0.020);
        vec3 glow = vec3(0.35, 0.12, 1.00) * veil * vignette;
        vec3 scanline = vec3(0.09, 0.04, 0.28) * scan * vignette;
        vec3 color = base + glow + scanline;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertex);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uScanFreq = gl.getUniformLocation(program, "uScanFreq");
    const uSpeed = gl.getUniformLocation(program, "uSpeed");

    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const loop = () => {
      const elapsed = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uScanFreq, Math.max(0.1, scanlineFrequency));
      gl.uniform1f(uSpeed, Math.max(0.1, speed));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [scanlineFrequency, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
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
    const scanlineFrequency = Number(params.scanlineFrequency ?? 0.5);
    const speed = Number(params.speed ?? 3);
    const DarkVeil = maybeExports.DarkVeil as ComponentType<Record<string, unknown>> | undefined;
    if (DarkVeil) {
      return <DarkVeil {...params} />;
    }
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: fallbackColor }}>
        <DarkVeilCanvas scanlineFrequency={scanlineFrequency} speed={speed} />
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

  const scanlineFrequency = Number(params.scanlineFrequency ?? 0.5);
  const speed = Number(params.speed ?? 3);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: fallbackColor }}>
      <DarkVeilCanvas scanlineFrequency={scanlineFrequency} speed={speed} />
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
