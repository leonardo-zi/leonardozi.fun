import { useEffect } from "react";
import Lenis from "lenis";
import HomePage from "./pages/HomePage";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // 允许嵌套滚动：弹窗/侧栏内部的 `overflow-y-auto` 容器在某些触摸路径下
      // 可能无法被 `data-lenis-prevent` 完全命中，从而导致 Lenis 锁定时触摸滑动看起来失效。
      // 这里启用 Lenis 的嵌套滚动检测兜底，消除“概率失效”。
      allowNestedScroll: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <HomePage />;
}
