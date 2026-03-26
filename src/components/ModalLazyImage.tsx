import { useEffect, useMemo, useRef, useState } from "react";

type NativeLoading = "eager" | "lazy";

interface ModalLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  /** 仅用于占位，防止布局在图片出现前塌陷 */
  placeholderMinHeight?: number;
  /** 弹窗滚动容器（IntersectionObserver root） */
  scrollRoot?: React.RefObject<HTMLElement | null>;
  /** true 时立即加载；否则滚入弹窗可视区再开始加载 */
  eager?: boolean;
}

export default function ModalLazyImage({
  src,
  alt,
  className,
  placeholderMinHeight = 240,
  scrollRoot,
  eager = false,
}: ModalLazyImageProps) {
  const [shouldLoad, setShouldLoad] = useState(eager);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) {
      setShouldLoad(true);
    }
  }, [eager, src]);

  useEffect(() => {
    if (shouldLoad) return;
    const el = hostRef.current;
    if (!el) return;

    const rootEl = scrollRoot?.current ?? null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
            break;
          }
        }
      },
      {
        root: rootEl,
        rootMargin: "240px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollRoot, shouldLoad]);

  const loading: NativeLoading = useMemo(() => (eager ? "eager" : "lazy"), [eager]);

  return (
    <div ref={hostRef} className={className} style={{ minHeight: placeholderMinHeight }}>
      {shouldLoad ? <img src={src} alt={alt} className="w-full h-auto block object-cover" loading={loading} decoding="async" /> : null}
    </div>
  );
}

