import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";

interface LenisPreventScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Lenis 在嵌套滚动场景下偶发“手势滑动失效”的兜底：
 * 给可滚动容器加 `data-lenis-prevent`，让 Lenis 对该容器不做平滑接管，
 * 使用原生滚动/惯性。
 *
 * 用法：所有弹窗/侧栏里的 `overflow-y-auto` 滚动容器都建议复用此组件。
 */
const LenisPreventScrollArea = forwardRef<HTMLDivElement, LenisPreventScrollAreaProps>(function LenisPreventScrollArea(
  { children, ...rest },
  ref,
) {
  const lenisRef = useRef<Lenis | null>(null);

  // 复用全局 Lenis 的缓动感觉，尽量保持一致体感
  const easing = useMemo(
    () => (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    [],
  );

  useEffect(() => {
    const el = ref && typeof ref !== "function" ? ref.current : null;
    if (!el) return;

    // 避免重复挂载（React 严格模式下可能出现额外 mount/unmount）
    if (lenisRef.current) return;

    const lenis = new Lenis({
      wrapper: el,
      content: el,
      eventsTarget: el,
      orientation: "vertical",
      gestureOrientation: "vertical",
      // 只保证 wheel/触控板有阻尼平滑；触摸滚动仍以原生为主（避免 iOS 兼容风险）
      smoothWheel: true,
      duration: 1.2,
      easing,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      // 让触摸滚动也走 Lenis 的惯性/阻尼逻辑（这样弹窗内也能“有感觉”）
      // 仍然依赖 data-lenis-prevent 避免全局 Lenis 抢手势导致的概率性失效。
      syncTouch: true,
      allowNestedScroll: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [easing, ref]);

  return (
    <div
      ref={ref}
      {...rest}
      data-lenis-prevent="true"
    >
      {children}
    </div>
  );
});

export default LenisPreventScrollArea;

