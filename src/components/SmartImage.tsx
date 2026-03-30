import React, { forwardRef, useEffect, useRef, useState } from "react";

type NativeLoading = "eager" | "lazy";
type NativeDecoding = "async" | "auto" | "sync";

export interface SmartImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "loading" | "decoding"> {
  loading?: NativeLoading;
  decoding?: NativeDecoding;
  /** 图片容器 class（负责尺寸/圆角/布局） */
  containerClassName?: string;
  /** 骨架底色（不传则走全局 CSS 默认） */
  skeletonBg?: string;
  /** 仅在未加载完成时显示骨架 */
  showSkeleton?: boolean;
}

function markLoaded(img: HTMLImageElement | null, setLoaded: (v: boolean) => void) {
  if (!img) return;
  if (img.complete && img.naturalWidth > 0) setLoaded(true);
}

const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(function SmartImage(
  {
    src,
    alt,
    className,
    containerClassName,
    skeletonBg,
    showSkeleton = true,
    onLoad,
    onError,
    style,
    ...rest
  },
  forwardedRef
) {
  const innerRef = useRef<HTMLImageElement | null>(null);
  const setRefs = (node: HTMLImageElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    const img = innerRef.current;
    markLoaded(img, setLoaded);
  }, [src]);

  return (
    <div className={`smart-image ${containerClassName ?? ""}`} data-loaded={loaded}>
      {showSkeleton ? (
        <div
          className="smart-image-skeleton"
          data-active={!loaded}
          aria-hidden
          style={skeletonBg ? ({ ["--smart-image-skeleton-bg" as string]: skeletonBg } as React.CSSProperties) : undefined}
        />
      ) : null}
      <img
        ref={setRefs}
        src={src}
        alt={alt}
        {...rest}
        className={`smart-image-media ${className ?? ""}`}
        style={style}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
      />
    </div>
  );
});

export default SmartImage;

