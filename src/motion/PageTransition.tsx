import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { pageTransitionReducedVariants, pageTransitionVariants } from "./presets";

/**
 * 唯一的路由级 AnimatePresence：子路由通过 useOutlet 渲染，key 用 pathname 驱动进离场。
 */
export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? pageTransitionReducedVariants : pageTransitionVariants;

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
