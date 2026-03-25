import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Work } from "../works/types";

interface WorkCardProps {
  work: Work;
  onClick?: (work: Work, origin: { x: number; y: number }) => void;
  /** 首张卡片直接可见，避免懒加载未触发导致点不开 */
  isFirst?: boolean;
  lang: "cn" | "en";
}

export default function WorkCard({ work, onClick, isFirst, lang }: WorkCardProps) {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(!!isFirst);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "120px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
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
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className="rounded-[8px] p-2 border-[0.5px] border-transparent cursor-pointer"
      >
        <div className="relative w-full overflow-hidden rounded-superellipse border-[0.5px] border-[#e0e0e0]">
          <img
            src={work.image}
            alt={work.title}
            className="block w-full object-cover"
            style={{ height: work.cardImageHeightPx ?? 509 }}
            loading="lazy"
          />
          {work.overlayIcon && (
            <img
              src={work.overlayIcon}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 max-h-[88%] max-w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          )}
        </div>
        <h3 className="mt-2 text-[12px] font-medium text-[#000000]">{work.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-[12px] text-[#000000]">
          {(lang === "en" ? work.tagsEn ?? work.tags : work.tags).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          <span>{work.date}</span>
        </div>
      </div>
    );
  }

  const itemVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0.2, ease: "easeOut" as const }
        : {
            duration: 0.85,
            ease: [0.22, 0.65, 0.12, 1] as [number, number, number, number],
          },
    },
  };

  return (
    <motion.article ref={cardRef as React.RefObject<HTMLElement>} className="min-w-0 overflow-hidden rounded-[8px]" variants={itemVariants}>
      {!isVisible ? <div className="work-card-skeleton min-h-[200px] w-full" /> : renderCardContent()}
    </motion.article>
  );
}
