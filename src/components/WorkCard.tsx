import { useEffect, useRef, useState } from "react";
import type { Work } from "../data/works";

interface WorkCardProps {
  work: Work;
  onClick?: (work: Work, origin: { x: number; y: number }) => void;
}

export default function WorkCard({ work, onClick }: WorkCardProps) {
  const [isVisible, setIsVisible] = useState(false);
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

  const isFull = work.layout === "full";
  const aspectClass = isFull ? "aspect-3/2" : "aspect-square";

  function renderCardContent() {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className="rounded-[8px] p-2 -m-2 border-[0.5px] border border-transparent transition-[background-color,border-color] duration-200 ease-out hover:bg-[#f4f4f4] hover:border-[#e0e0e0] cursor-pointer"
      >
        <div className={"rounded-superellipse overflow-hidden bg-[rgba(162,157,150,0.12)] " + aspectClass}>
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-full block object-cover"
            loading="lazy"
          />
        </div>
        <h3 className="mt-2 text-base font-medium text-[rgba(38,37,31,1)]">{work.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-[rgba(162,157,150,1)]">
          {work.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          <span>{work.date}</span>
        </div>
      </div>
    );
  }

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className={isFull ? "col-span-2" : ""}
    >
      {/* 样式：full 时 col-span-2 占两列 */}
      {!isVisible ? (
        <div className="rounded-[8px] p-2 -m-2">
          {/* 样式：骨架 .work-card-skeleton，full 为 3:2、half 为 1:1 */}
          <div className={"work-card-skeleton " + aspectClass} />
        </div>
      ) : (
        renderCardContent()
      )}
    </article>
  );
}
