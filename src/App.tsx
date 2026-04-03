import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import MusicPage from "./features/music/MusicPage";
import WorksPage from "./features/works/WorksPage";
import SiteLayout from "./layouts/SiteLayout";
import { SitePreferencesProvider } from "./layouts/SitePreferencesContext";
import PageTransition from "./motion/PageTransition";
import WorkDetailRoute from "./pages/WorkDetailRoute";

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      allowNestedScroll: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      stopInertiaOnNavigate: true,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.stop();
    lenis.start();
  }, [location.pathname]);

  return (
    <SitePreferencesProvider>
      <Routes>
        <Route path="/work/:workId" element={<WorkDetailRoute />} />
        <Route element={<SiteLayout />}>
          <Route element={<PageTransition />}>
            <Route index element={<WorksPage />} />
            <Route path="music" element={<MusicPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SitePreferencesProvider>
  );
}
