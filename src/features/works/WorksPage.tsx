import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import WorkCard from "../../components/WorkCard";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { Work } from "../../works/types";
import {
  WORKS_STAGGER_TIMING,
  worksStaggerContainer,
  worksStaggerContainerWide,
  worksStaggerItem,
  worksStaggerItemMobile,
} from "../../motion/presets";
import { useSitePreferences } from "../../layouts/SitePreferencesContext";
import { useWorksColumns } from "./hooks/useWorksColumns";
import { useWorksImagePreload } from "./hooks/useWorksImagePreload";

const LEGACY_WORK_QUERY = "work";

export default function WorksPage() {
  const { lang } = useSitePreferences();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { worksLeftColumn, worksRightColumn, worksInterleaved } = useWorksColumns();
  const { pageLoadNonce, cardsReadyForReveal } = useWorksImagePreload(worksInterleaved);
  const reduceMotion = useReducedMotion();

  const isSingleColumn = useMediaQuery("(max-width: 1230px)");
  const isMobileViewport = useMediaQuery("(max-width: 800px)");

  const worksItemVariants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0 } } }
    : isMobileViewport
      ? worksStaggerItemMobile
      : worksStaggerItem;

  const workRowIndex = useMemo(() => {
    const m = new Map<string, number>();
    worksInterleaved.forEach((w, i) => m.set(w.id, i));
    return m;
  }, [worksInterleaved]);

  const wideItemVariants: Variants = useMemo(() => {
    if (reduceMotion) {
      return {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0, transition: { duration: 0 } },
      };
    }
    const { delayChildren, staggerChildren } = WORKS_STAGGER_TIMING;
    const duration = isMobileViewport ? 0.58 : 0.72;
    const yHidden = isMobileViewport ? 56 : 72;
    return {
      hidden: { opacity: 0, y: yHidden },
      show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration,
          ease: [0.16, 1, 0.3, 1] as const,
          delay: delayChildren + (typeof i === "number" ? i : 0) * staggerChildren,
        },
      }),
    };
  }, [reduceMotion, isMobileViewport]);

  useEffect(() => {
    const id = searchParams.get(LEGACY_WORK_QUERY);
    if (!id) return;
    navigate(`/work/${encodeURIComponent(id)}`, { replace: true });
  }, [searchParams, navigate]);

  useEffect(() => {
    const nextWorkImage =
      (worksInterleaved[1]?.image ?? worksLeftColumn[1]?.image ?? worksRightColumn[0]?.image) || null;

    if (!nextWorkImage) return;

    const run = () => {
      const img = new Image();
      img.decoding = "async";
      img.src = nextWorkImage;
    };

    if ("requestIdleCallback" in window) {
      const idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback(
        run,
        { timeout: 1200 }
      );
      return () => {
        (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback?.(idleId);
      };
    }

    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [worksInterleaved, worksLeftColumn, worksRightColumn]);

  const openWorkDetails = (work: Work) => {
    navigate(`/work/${work.id}`);
  };

  const gridAnimate = cardsReadyForReveal ? "show" : "hidden";

  if (isSingleColumn) {
    return (
      <motion.div
        className="grid grid-cols-1 gap-4"
        variants={worksStaggerContainer}
        initial="hidden"
        animate={gridAnimate}
      >
        {worksInterleaved.map((work, i) => (
          <motion.div key={`${work.id}-${pageLoadNonce}`} variants={worksItemVariants} className="min-w-0">
            <WorkCard work={work} onClick={openWorkDetails} isFirst={i === 0} lang={lang} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 items-start gap-4 [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]"
      variants={worksStaggerContainerWide}
      initial="hidden"
      animate={gridAnimate}
    >
      <div className="flex min-w-0 flex-col gap-4">
        {worksLeftColumn.map((work, i) => (
          <motion.div
            key={`${work.id}-${pageLoadNonce}`}
            custom={workRowIndex.get(work.id) ?? 0}
            variants={wideItemVariants}
            className="min-w-0"
          >
            <WorkCard work={work} onClick={openWorkDetails} isFirst={i === 0} lang={lang} />
          </motion.div>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {worksRightColumn.map((work) => (
          <motion.div
            key={`${work.id}-${pageLoadNonce}`}
            custom={workRowIndex.get(work.id) ?? 0}
            variants={wideItemVariants}
            className="min-w-0"
          >
            <WorkCard work={work} onClick={openWorkDetails} isFirst={false} lang={lang} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
